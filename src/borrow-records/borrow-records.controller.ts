import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BorrowRecordsService } from './borrow-records.service';
import { CreateBorrowRecordDto } from './dto/create-borrow-record.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards';
import { BorrowRecord } from '@prisma/client';

@ApiTags('Borrow Records')
@Controller('borrow-records')
export class BorrowRecordsController {
  constructor(private readonly borrowRecordsService: BorrowRecordsService) {}

  /**
   * [Member, Librarian, Admin] can borrow book.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createBorrowRecordDto: CreateBorrowRecordDto,
  ): Promise<BorrowRecord | { message: string }> {
    return this.borrowRecordsService.create(createBorrowRecordDto);
  }

  /**
   * [Admin] can view all borrowing records.
   */
  @Get()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<BorrowRecord[]> {
    return this.borrowRecordsService.findAll();
  }

  /**
   * [Admin] can view specific borrowing records.
   */
  @Get(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<BorrowRecord> {
    return this.borrowRecordsService.findOne(id);
  }

  /**
   * [Member, Librarian, Admin] can return a book.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  returnBook(@Param('id') id: string): Promise<{ message: string }> {
    return this.borrowRecordsService.returnBook(id);
  }

  /**
   * [Admin] can delete borrow record.
   */
  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.borrowRecordsService.remove(id);
  }
}
