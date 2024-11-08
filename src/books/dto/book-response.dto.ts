import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateBookDto } from './create-book.dto';
import { Transform } from 'class-transformer';

export class BookResponseDto extends PartialType(CreateBookDto) {
  @ApiProperty({
    description: 'The id of the book.',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description:
      'The date at which the book was added to the library management system.',
    type: Date,
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  created_at: Date;

  @ApiProperty({
    description: 'The date at which the book details were updated.',
    type: Date,
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  updated_at: Date;
}
