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
  UseGuards,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../commons/dto/pagination.dto';

@Controller('book')
@ApiTags('book')
@ApiBearerAuth('access-token')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
    type: Book,
  })
  @UseGuards(AuthGuard())
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The records has been successfully retrieved.',
    type: [Book],
  })
  findAll(@Query() pagination: PaginationDto): Promise<Book[]> {
    return this.bookService.findAll(pagination);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully retrieved.',
    type: Book,
  })
  @UseGuards(AuthGuard())
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
    type: Book,
  })
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
  remove(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.bookService.remove(id);
  }
}
