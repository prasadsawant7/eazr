import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AdminLibrarianGuard } from 'src/common/guards/admin-librarian/admin-librarian.guard';
import { BorrowRecord, BorrowStatus } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * [Admin] can create a user.
   */
  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  /**
   * [Librarian, Admin] can view all users.
   */
  @Get()
  @UseGuards(AdminLibrarianGuard)
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  /**
   * [Librarian, Admin] can specific user details.
   */
  @Get(':id')
  @UseGuards(AdminLibrarianGuard)
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: string,
  ): Promise<UserResponseDto | { message: string }> {
    return this.usersService.findOne(id);
  }

  /**
   * [Member, Librarian, Admin] can view user borrowing history.
   */
  @Get(':id/history')
  @HttpCode(HttpStatus.OK)
  findUserHistory(
    @Param('id') userId: string,
    @Query('status') status?: BorrowStatus,
  ): Promise<BorrowRecord[] | { message: string }> {
    return this.usersService.findUserHistory(userId, status);
  }

  /**
   * [Librarian, Admin] can update user details.
   */
  @Patch(':id')
  @UseGuards(AdminLibrarianGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * [Admin] can delete any user.
   */
  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}
