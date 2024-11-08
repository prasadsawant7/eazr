import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { BorrowRecord, BorrowStatus, Role } from '@prisma/client';
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

      const newUser = await this.dbService.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password_hash: hash,
          role: dto.role as Role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
        },
      });

      return newUser;
    } else {
      throw new ConflictException('User already exists!');
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

  async findOne(id: string): Promise<UserResponseDto | { message: string }> {
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

    if (!user) {
      return { message: "User doesn't exist!" };
    }

    return user;
  }

  async findUserHistory(
    id: string,
    status: BorrowStatus,
  ): Promise<BorrowRecord[] | { message: string }> {
    if (status) {
      if (!Object.values(BorrowStatus).includes(status)) {
        return { message: 'Invalid status value!' };
      }

      const userHistory = await this.dbService.borrowRecord.findMany({
        where: {
          user_id: id,
          status: status as BorrowStatus,
        },
        include: {
          Book: {
            select: {
              id: true,
              isbn: true,
              title: true,
              author: true,
            },
          },
        },
      });

      return userHistory;
    }

    const userHistory = await this.dbService.borrowRecord.findMany({
      where: {
        user_id: id,
      },
      include: {
        Book: {
          select: {
            isbn: true,
            title: true,
            author: true,
          },
        },
      },
    });

    return userHistory;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const updateData: UpdateUserDto & { password_hash: string } = {
      ...dto,
      password_hash: '',
    };

    if (dto.password) {
      const hash = await hashData(dto.password);
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

  async remove(id: string): Promise<{ message: string }> {
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
