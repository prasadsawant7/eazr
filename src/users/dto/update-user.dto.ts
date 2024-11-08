import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user.',
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The password for the user account. Must be strong.',
    type: String,
  })
  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @ApiProperty({
    description: 'The role of the user in the application.',
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
