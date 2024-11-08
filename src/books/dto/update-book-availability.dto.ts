import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateBookAvailabilityDto {
  @ApiProperty({
    description: 'The availability of the book (if true, it means available).',
    type: Date,
  })
  @IsNotEmpty()
  @IsBoolean()
  availability: boolean;
}
