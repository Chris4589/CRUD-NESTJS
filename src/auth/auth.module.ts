import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../commons/jwt-strategys';
import { PassportModule } from '@nestjs/passport';
import { AuditModule } from '../audit/audit.module';
import { BunyanLogger } from '../commons/bunyan-logger';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, BunyanLogger],
  exports: [TypeOrmModule, JwtModule, PassportModule],
  imports: [
    forwardRef(() => AuditModule), // referencia circular
    TypeOrmModule.forFeature([Auth]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        secret: process.env.SERVER_SECRET,
        signOptions: { expiresIn: process.env.SERVER_EXPIRE },
      }),
    }),
  ],
})
export class AuthModule {}
