import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';

@Module({
  controllers: [AuditController],
  providers: [AuditService],
  imports: [TypeOrmModule.forFeature([Audit])],
})
export class AuditModule {}
