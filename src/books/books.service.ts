import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UpdateBookAvailabilityDto } from './dto/update-book-availability.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BooksService {
  constructor(private dbService: DatabaseService) {}

  async create(dto: CreateBookDto): Promise<BookResponseDto> {
    const book = await this.dbService.book.findUnique({
      where: {
        isbn: dto.isbn,
      },
    });

    if (!book) {
      const newBook = await this.dbService.book.create({
        data: {
          isbn: dto.isbn,
          title: dto.title,
          author: dto.author,
          genre: dto.genre,
          published_date: dto.published_date,
          availability: dto.availability,
        },
      });

      return newBook;
    } else {
      throw new ConflictException('Book already exists!');
    }
  }

  async findAll(): Promise<BookResponseDto[]> {
    const books = await this.dbService.book.findMany();
    return books;
  }

  async findOne(id: string): Promise<BookResponseDto> {
    const book = await this.dbService.book.findUnique({
      where: {
        id: id,
      },
    });

    return book;
  }

  async update(id: string, dto: UpdateBookDto): Promise<BookResponseDto> {
    const updatedBook = await this.dbService.book.update({
      where: {
        id: id,
      },
      data: dto,
    });

    return updatedBook;
  }

  async updateAvailability(
    id: string,
    dto: UpdateBookAvailabilityDto,
  ): Promise<BookResponseDto> {
    const availabilityUpdatedBook = await this.dbService.book.update({
      where: {
        id: id,
      },
      data: {
        availability: dto.availability,
      },
    });

    return availabilityUpdatedBook;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedBook = await this.dbService.book.delete({
      where: {
        id: id,
      },
      select: {
        isbn: true,
        title: true,
        author: true,
      },
    });

    return {
      message: `The book [isbn: ${deletedBook.isbn}] ${deletedBook.title} by ${deletedBook.author} has been deleted!`,
    };
  }
}
