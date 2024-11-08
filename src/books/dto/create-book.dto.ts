import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsISBN, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description:
      'The International Standard Book Number is a numeric commercial book identifier that is intended to be unique.',
    type: String,
  })
  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @ApiProperty({
    description: 'The title of the book.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The author of the book.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({
    description: 'The genre of the book.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  genre: string;

  @ApiProperty({
    description: 'The date at which the book was published.',
    type: Date,
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  published_date: Date;

  @ApiProperty({
    description: 'The availability of the book (if true, it means available).',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  availability: boolean;
}
