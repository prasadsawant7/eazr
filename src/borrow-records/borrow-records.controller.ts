import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BorrowRecordsService } from './borrow-records.service';
import { CreateBorrowRecordDto } from './dto/create-borrow-record.dto';
import { UpdateBorrowRecordDto } from './dto/update-borrow-record.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards';

@ApiTags('Borrow Records')
@Controller('borrow-records')
export class BorrowRecordsController {
  constructor(private readonly borrowRecordsService: BorrowRecordsService) {}

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createBorrowRecordDto: CreateBorrowRecordDto) {
    return this.borrowRecordsService.create(createBorrowRecordDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.borrowRecordsService.findAll();
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowRecordsService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBorrowRecordDto: UpdateBorrowRecordDto,
  ) {
    return this.borrowRecordsService.update(+id, updateBorrowRecordDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowRecordsService.remove(+id);
  }
}
