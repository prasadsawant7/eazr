import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBookAvailabilityDto } from './dto/update-book-availability.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { AdminLibrarianGuard } from 'src/common/guards/admin-librarian/admin-librarian.guard';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * [Librarian, Admin] can create a book.
   */
  @Post()
  @UseGuards(AdminLibrarianGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookDto: CreateBookDto): Promise<BookResponseDto> {
    return this.booksService.create(createBookDto);
  }

  /**
   * [Member, Librarian, Admin] can view all books.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<BookResponseDto[]> {
    return this.booksService.findAll();
  }

  /**
   * [Member, Librarian, Admin] can view a specific book.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<BookResponseDto> {
    return this.booksService.findOne(id);
  }

  /**
   * [Librarian, Admin] can update book details.
   */
  @Patch(':id')
  @UseGuards(AdminLibrarianGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<BookResponseDto> {
    return this.booksService.update(id, updateBookDto);
  }

  /**
   * [Librarian, Admin] can update book availability status.
   */
  @Patch(':id/availability')
  @UseGuards(AdminLibrarianGuard)
  @HttpCode(HttpStatus.OK)
  updateAvailability(
    @Param('id') id: string,
    @Body() updateAvailabilityBookDto: UpdateBookAvailabilityDto,
  ): Promise<BookResponseDto> {
    return this.booksService.updateAvailability(id, updateAvailabilityBookDto);
  }

  /**
   * [Librarian, Admin] can delete any book.
   */
  @Delete(':id')
  @UseGuards(AdminLibrarianGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.booksService.remove(id);
  }
}
