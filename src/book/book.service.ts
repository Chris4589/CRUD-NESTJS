import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotContentException } from '../exceptions/NotContentException';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  private logger: Logger = new Logger(BookService.name);
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
      this.logger.error('Book already exists');
      throw new ConflictException('Book already exists');
    }
    const user = await this.findUser(createBookDto.renter);
    const book = Book.fromCreateBookDto(createBookDto);
    book.renter = user;
    const newBook = await this.bookRepository.save(book);
    this.logger.log(`Book ${newBook.title} created`);
    return newBook;
  }

  async findAll(): Promise<Book[]> {
    const books = await this.bookRepository.find();
    if (books.length === 0) {
      this.logger.error('No books found');
      throw new NotContentException('No books found');
    }
    return books;
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      this.logger.error('No book found');
      throw new NotContentException('No book found');
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const userExists = await this.findUser(updateBookDto.renter);
    const bookExists = await this.findOne(id);

    if (!bookExists) {
      this.logger.error('No book found');
      throw new NotContentException('No book found');
    }
    const parseBook = await this.bookRepository.preload({
      id: id,
      ...Book.fromUpdateBookDto(updateBookDto),
    });
    parseBook.renter = userExists;
    const newBook = await this.bookRepository.save(parseBook);
    this.logger.log(`Book ${newBook.title} updated`);
    return newBook;
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
    this.logger.log(`Book ${book.title} deleted`);
    return book;
  }

  async findUser(id: number) {
    const user = await this.authRepository.findOneBy({ id });
    if (!user) {
      this.logger.error('No user found');
      throw new NotContentException('No user found');
    }
    this.logger.log(`User found: ${user.email}`);
    return user;
  }
}
