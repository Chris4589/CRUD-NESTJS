import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AuditController],
  providers: [AuditService],
  imports: [TypeOrmModule.forFeature([Audit]), AuthModule],
  exports: [AuditService],
})
export class AuditModule {}
