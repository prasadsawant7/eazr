import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, Role, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { AuthResponse, Tokens } from '../types';
import { LocalAuthSignupDTO, LocalAuthSigninDTO } from '../dto';
import * as argon2 from 'argon2';

@Injectable()
export class LocalAuthService {
  constructor(
    private dbService: DatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signupLocal(dto: LocalAuthSignupDTO): Promise<AuthResponse> {
    try {
      const user = await this.dbService.user.findUnique({
        where: {
          email: dto.email,
          role: dto.role,
        },
      });

      let newUser: User;

      if (!user) {
        const hash = await this.hashData(dto.password);

        newUser = await this.dbService.user.create({
          data: {
            name: dto.name,
            email: dto.email,
            password_hash: hash,
            role: dto.role as Role,
          },
        });
      }

      const tokens = await this.getTokens(
        newUser.id,
        newUser.email,
        newUser.role as Role,
      );
      await this.updateRTHash(newUser.id, tokens.refresh_token);

      return {
        user_id: newUser.id,
        user_email: newUser.email,
        user_role: newUser.role,
        ...tokens,
      };
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User already exists');
      }

      throw error;
    }
  }

  async signinLocal(dto: LocalAuthSigninDTO): Promise<AuthResponse> {
    const user = await this.dbService.user.findUnique({
      where: {
        email: dto.email,
        role: dto.role,
      },
    });

    if (!user) throw new ForbiddenException(`Invalid Credentials!`);

    const passwordMatches = await argon2.verify(
      user.password_hash,
      dto.password,
    );
    if (!passwordMatches) throw new ForbiddenException('Invalid Credentials!');

    const userRoleMatches = user.role === dto.role ? true : false;
    if (!userRoleMatches) throw new ForbiddenException('Invalid Credentials!');

    const tokens = await this.getTokens(user.id, user.email, user.role as Role);
    await this.updateRTHash(user.id, tokens.refresh_token);

    return {
      user_id: user.id,
      user_email: user.email,
      user_role: user.role,
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.dbService.user.updateMany({
      where: {
        id: userId,
        hashed_rt: {
          not: null,
        },
      },
      data: {
        hashed_rt: null,
      },
    });
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.dbService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashed_rt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon2.verify(user.hashed_rt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role as Role);
    await this.updateRTHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRTHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.dbService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashed_rt: hash,
      },
    });
  }

  async hashData(data: string) {
    return await argon2.hash(data);
  }

  async getTokens(userId: string, email: string, role: Role): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('jwtConfig.atSecret'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('jwtConfig.rtSecret'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
