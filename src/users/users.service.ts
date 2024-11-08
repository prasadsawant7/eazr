import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Role, User } from '@prisma/client';
import { hashData } from 'src/utils';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private dbService: DatabaseService) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.dbService.user.findUnique({
      where: {
        email: dto.email,
        role: dto.role,
      },
    });

    if (!user) {
      const hash = await hashData(dto.password);

      const newUser: User = await this.dbService.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password_hash: hash,
          role: dto.role as Role,
        },
      });

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at,
      };
    } else {
      throw new ConflictException('User already exists');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.dbService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    return users;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.dbService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updateData: UpdateUserDto & { password_hash: string } = {
      ...updateUserDto,
      password_hash: '',
    };

    if (updateUserDto.password) {
      const hash = await hashData(updateUserDto.password);
      updateData.password_hash = hash;
      delete updateData.password;
    } else {
      delete updateData.password_hash;
    }

    const updatedUser = await this.dbService.user.update({
      where: {
        id: id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.dbService.user.delete({
      where: {
        id: id,
      },
      select: {
        name: true,
      },
    });

    return { message: `${deletedUser.name}'s account has been deleted!` };
  }
}
