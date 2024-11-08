import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBorrowRecordDto {
  @ApiProperty({
    description: 'The id of the user who is borrowing the book.',
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'The id of the book which is being borrowed by the member.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  book_id: string;
}
