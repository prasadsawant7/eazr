import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBorrowRecordDto } from './create-borrow-record.dto';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBorrowRecordDto extends PartialType(CreateBorrowRecordDto) {
  @ApiProperty({
    description: 'The date when user borrowed the book.',
    type: Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  borrowed_date?: Date;

  @ApiProperty({
    description: 'The date before user is supposed to return the book.',
    type: Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  due_date?: Date;

  // @ApiProperty({
  //   description: 'The date when user returned the book.',
  //   type: Date,
  // })
  // @IsOptional()
  // @Transform(({ value }) => new Date(value))
  // returned_date?: Date;

  // @ApiProperty({
  //   description: 'The id of the book which is being borrowed by the member.',
  //   enum: BorrowStatus,
  // })
  // @IsOptional()
  // @IsEnum(BorrowStatus)
  // status?: BorrowStatus;
}
