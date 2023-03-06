import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotContentException } from '../exceptions/NotContentException';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { PaginationDto } from '../commons/dto/pagination.dto';
import { BunyanLogger } from '../commons/bunyan-logger';

@Injectable()
export class BookService {
  // private logger: Logger = new Logger(BookService.name);
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly bunyanLogger: BunyanLogger,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const bookExists = await this.bookRepository.findOne({
      where: { title: createBookDto.title },
    });
    if (bookExists) {
      // this.logger.error('Book already exists');
      this.bunyanLogger.logError(409, BookService.name, 'Book already exists');
      throw new ConflictException('Book already exists');
    }
    const user = await this.findUser(createBookDto.renter);
    const book = Book.fromCreateBookDto(createBookDto);
    book.renter = user;
    const newBook = await this.bookRepository.save(book);
    // this.logger.log(`Book ${newBook.title} created`);
    this.bunyanLogger.logInfo(201, BookService.name, 'Book created');
    return newBook;
  }

  async findAll(pagination: PaginationDto): Promise<Book[]> {
    const { limit = 10, offset = 0 } = pagination;
    const books = await this.bookRepository.find({
      take: limit,
      skip: offset,
    });
    if (books.length === 0) {
      this.bunyanLogger.logError(204, BookService.name, 'No books found');
      throw new NotContentException('No books found');
    }
    this.bunyanLogger.logInfo(200, BookService.name, 'Books found');
    return books;
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      // this.logger.error('No book found');
      this.bunyanLogger.logError(204, BookService.name, 'No book found');
      throw new NotContentException('No book found');
    }
    this.bunyanLogger.logInfo(200, BookService.name, 'Book found');
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const userExists = await this.findUser(updateBookDto.renter);
    const bookExists = await this.findOne(id);

    if (!bookExists) {
      //this.logger.error('No book found');
      this.bunyanLogger.logError(204, BookService.name, 'No book found');
      throw new NotContentException('No book found');
    }
    const parseBook = await this.bookRepository.preload({
      id: id,
      ...Book.fromUpdateBookDto(updateBookDto),
    });
    parseBook.renter = userExists;
    const newBook = await this.bookRepository.save(parseBook);
    this.bunyanLogger.logInfo(200, BookService.name, 'Book updated');
    // this.logger.log(`Book ${newBook.title} updated`);
    return newBook;
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
    // this.logger.log(`Book ${book.title} deleted`);
    this.bunyanLogger.logInfo(200, BookService.name, 'Book deleted');
    return book;
  }

  async findUser(id: number) {
    const user = await this.authRepository.findOneBy({ id });
    if (!user) {
      // this.logger.error('No user found');
      this.bunyanLogger.logError(204, BookService.name, 'No user found');
      throw new NotContentException('No user found');
    }
    // this.logger.log(`User found: ${user.email}`);
    this.bunyanLogger.logInfo(200, BookService.name, 'User found');
    return user;
  }
}
