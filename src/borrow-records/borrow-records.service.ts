import { Injectable } from '@nestjs/common';
import { CreateBorrowRecordDto } from './dto/create-borrow-record.dto';
import { UpdateBorrowRecordDto } from './dto/update-borrow-record.dto';
import { DatabaseService } from 'src/database/database.service';
import { BorrowRecord } from '@prisma/client';

@Injectable()
export class BorrowRecordsService {
  constructor(private dbService: DatabaseService) {}

  async create(
    dto: CreateBorrowRecordDto,
  ): Promise<BorrowRecord | { message: string }> {
    const book = await this.dbService.book.findUnique({
      where: {
        id: dto.book_id,
      },
      select: {
        availability: true,
      },
    });

    if (!book || !book.availability) {
      return {
        message: `Book is borrowed by someone else.`,
      };
    }

    const newBorrowRecord = await this.dbService.borrowRecord.create({
      data: {
        user_id: dto.user_id,
        book_id: dto.book_id,
        borrowed_date: new Date(),
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      },
    });

    await this.dbService.book.update({
      where: {
        id: dto.book_id,
      },
      data: {
        availability: false,
      },
    });

    return newBorrowRecord;
  }

  async findAll(): Promise<BorrowRecord[]> {
    const borrowRecords = await this.dbService.borrowRecord.findMany();
    return borrowRecords;
  }

  async findOne(id: string): Promise<BorrowRecord> {
    const borrowRecord = await this.dbService.borrowRecord.findUnique({
      where: {
        id: id,
      },
    });

    return borrowRecord;
  }

  async update(
    id: string,
    dto: UpdateBorrowRecordDto,
  ): Promise<BorrowRecord | { message: string }> {
    const updatedBorrowRecord = await this.dbService.borrowRecord.update({
      where: {
        id: id,
      },
      data: dto,
    });

    if (!updatedBorrowRecord) {
      return { message: `There is no borrow record available with id #${id}` };
    }

    return updatedBorrowRecord;
  }

  async returnBook(id: string): Promise<{ message: string }> {
    const now = new Date();
    const borrowRecord = await this.dbService.borrowRecord.findUnique({
      where: { id },
    });

    const updatedBorrowRecord = await this.dbService.$transaction(
      async (prisma) => {
        const updatedBorrowRecord = await prisma.borrowRecord.update({
          where: { id },
          data: {
            status: 'RETURNED',
            returned_date: now,
          },
        });

        await prisma.book.update({
          where: { id: borrowRecord.book_id },
          data: { availability: true },
        });

        return updatedBorrowRecord;
      },
    );

    if (!updatedBorrowRecord) {
      return { message: "Borrow Record doesn't exists!" };
    }

    return { message: 'Book returned successfully!' };
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedBorrowRecord = await this.dbService.borrowRecord.delete({
      where: {
        id: id,
      },
    });

    if (!deletedBorrowRecord) {
      return { message: "Record doesn't exists!" };
    }

    return { message: `Record #${deletedBorrowRecord.id} has been deleted!` };
  }
}
