import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Book } from './entities/book.entity';

@Controller('book')
@ApiTags('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
    type: Book,
  })
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The records has been successfully retrieved.',
    type: [Book],
  })
  findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully retrieved.',
    type: Book,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: Book,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully deleted.',
    type: Book,
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.bookService.remove(id);
  }
}
