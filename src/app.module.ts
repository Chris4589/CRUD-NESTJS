import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './book/book.module';
import { AuditModule } from './audit/audit.module';
import * as process from 'process';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ssl: Boolean(process.env.DB_SSL), // no usar ssl
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type: process.env.DB_DRIVER, // tipo de base de datos
      host: process.env.DB_HOST, // servidor
      port: +process.env.DB_PORT, // puerto
      username: process.env.DB_USERNAME, // usuario
      password: process.env.DB_PASSWORD, // password
      database: process.env.DB_DATABASE, // base de datos
      entities: entities, // entidades
      autoLoadEntities: true, // cargar entidades = false
      synchronize: true, // no se crea la base de datos si no existe = false
      schema: process.env.DB_SCHEMA, // esquema
      options: {
        encrypt: false,
      },
    }),
    AuditModule,
    AuthModule,
    BookModule,
  ],
})
export class AppModule {}
