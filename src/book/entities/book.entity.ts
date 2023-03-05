import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  author: string;

  @ManyToOne(() => Auth, (auth: Auth) => auth.books)
  renter: Auth;

  public static fromCreateBookDto(createBookDto: CreateBookDto): Book {
    const { renter, ...rest } = createBookDto;
    const book = new Book();
    Object.assign(book, rest);
    return book;
  }

  public static fromUpdateBookDto(updateBookDto: UpdateBookDto): Book {
    const { renter, ...rest } = updateBookDto;
    const book = new Book();
    Object.assign(book, rest);
    return book;
  }
}
