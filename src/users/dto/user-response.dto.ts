import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    description: 'The id of the user.',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The name of the user.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email address of the user.',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The role of the user in the application.',
    enum: Role,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: 'The role of the user in the application.',
    type: Date,
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  created_at: Date;

  // @ApiProperty({
  //   description: 'The borrow records of the user.',
  //   type: ,
  // })
  // @IsNotEmpty()
  // @Transform(({ value }) => new Date(value))
  // borrow_records?: Date;
}
