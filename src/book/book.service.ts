import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotContentException } from '../exceptions/NotContentException';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { PaginationDto } from '../commons/dto/pagination.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const bookExists = await this.bookRepository.findOne({
      where: { title: createBookDto.title },
    });
    if (bookExists) {
      throw new ConflictException('Book already exists');
    }
    const user = await this.findUser(createBookDto.renter);
    const book = Book.fromCreateBookDto(createBookDto);
    book.renter = user;
    return await this.bookRepository.save(book);
  }

  async findAll(pagination: PaginationDto): Promise<Book[]> {
    const { limit = 10, offset = 0 } = pagination;
    const books = await this.bookRepository.find({
      take: limit,
      skip: offset,
    });
    if (books.length === 0) {
      throw new NotContentException('No books found');
    }
    return books;
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotContentException('No book found');
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const userExists = await this.findUser(updateBookDto.renter);
    const bookExists = await this.findOne(id);

    if (!bookExists) {
      throw new NotContentException('No book found');
    }
    const parseBook = await this.bookRepository.preload({
      id: id,
      ...Book.fromUpdateBookDto(updateBookDto),
    });
    parseBook.renter = userExists;
    return await this.bookRepository.save(parseBook);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
    return book;
  }

  async findUser(id: number) {
    const user = await this.authRepository.findOneBy({ id });
    if (!user) {
      throw new NotContentException('No user found');
    }
    return user;
  }
}
