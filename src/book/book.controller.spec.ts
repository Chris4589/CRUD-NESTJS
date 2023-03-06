import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Auth } from '../auth/entities/auth.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { PaginationDto } from '../commons/dto/pagination.dto';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../commons/jwt-strategys';
import { PassportModule } from '@nestjs/passport';
import { BunyanLogger } from '../commons/bunyan-logger';

describe('BookController', () => {
  let controller: BookController;
  let bookRepository: Repository<Book>;
  let userRepository: Repository<Auth>;
  let book: Book;
  let user: Auth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        JwtStrategy,
        BookService,
        BunyanLogger,
        {
          provide: getRepositoryToken(Auth),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
        {
          provide: JwtStrategy,
          useValue: {
            sign: jest.fn(() => 'mock-token'),
            verify: jest.fn(() => ({ id: 1 })),
            validate: jest.fn(() => ({ id: 1 })),
          },
        },
        {
          provide: BunyanLogger,
          useValue: {
            logError: jest.fn(),
            logInfo: jest.fn(),
          },
        },
      ],
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [],
          inject: [],
          useFactory: () => ({
            secret: '1',
            signOptions: { expiresIn: '3h' },
          }),
        }),
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    userRepository = module.get<Repository<Auth>>(getRepositoryToken(Auth));

    book = new Book();
    book.id = 1;
    book.title = 'Test';
    book.author = 'Test';
    book.renter = new Auth();

    user = new Auth();
    user.id = 1;
    user.email = '';
  });

  it('findAll - ok', () => {
    jest.spyOn(bookRepository, 'find').mockResolvedValueOnce([book]);
    expect(controller.findAll(new PaginationDto())).resolves.toEqual([book]);
  });

  it('findAll - error', () => {
    jest.spyOn(bookRepository, 'find').mockResolvedValueOnce([]);
    expect(controller.findAll(new PaginationDto())).rejects.toThrow(
      'No books found',
    );
  });

  it('create - ok', () => {
    jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(undefined);
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user);
    jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(book);

    expect(controller.create(new CreateBookDto())).resolves.toEqual(book);
  });

  it('findOne - ok', () => {
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(book);
    expect(controller.findOne(1)).resolves.toEqual(book);
  });

  it('findOne - error', () => {
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(undefined);
    expect(controller.findOne(1)).rejects.toThrow('No book found');
  });

  it('update - ok', () => {
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(book);
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(undefined);
    jest.spyOn(bookRepository, 'preload').mockResolvedValueOnce(book);
    jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(book);
  });

  it('delete - ok', () => {
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(book);
    jest.spyOn(bookRepository, 'remove').mockResolvedValueOnce(book);
    expect(controller.remove(1)).resolves.toEqual(book);
  });
});
