import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Auth } from '../auth/entities/auth.entity';
import { AuthModule } from '../auth/auth.module';
import { BunyanLogger } from '../commons/bunyan-logger';

@Module({
  controllers: [BookController],
  providers: [BookService, BunyanLogger],
  exports: [BookModule],
  imports: [TypeOrmModule.forFeature([Auth, Book]), AuthModule],
})
export class BookModule {}
