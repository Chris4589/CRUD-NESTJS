import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../commons/dto/pagination.dto';
import { PostRequestInterceptor } from '../interceptors/postRequest.interceptor';
import { IncludeRoles } from '../decorators/role.decorator';
import { ROLES } from '../interfaces/roles.enum';
import { RoleGuard } from '../guards/role/role.guard';

@Controller('book')
@ApiTags('book')
@ApiBearerAuth('access-token') // primero el token
@IncludeRoles(ROLES.ADMIN, ROLES.USER) // luego el rol
@UseGuards(AuthGuard(), RoleGuard) // luego la informacion ya que salio gracias al token
@UseInterceptors(PostRequestInterceptor)
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
  findAll(@Query() pagination: PaginationDto): Promise<Book[]> {
    return this.bookService.findAll(pagination);
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
