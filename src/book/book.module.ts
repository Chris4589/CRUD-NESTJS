import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Auth } from '../auth/entities/auth.entity';

@Module({
  controllers: [BookController],
  providers: [BookService],
  exports: [BookModule],
  imports: [TypeOrmModule.forFeature([Auth, Book])],
})
export class BookModule {}
