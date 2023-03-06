import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { Repository } from 'typeorm';
import { Audit } from './entities/audit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotContentException } from '../exceptions/NotContentException';
import { PaginationDto } from '../commons/dto/pagination.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}
  async create(createAuditDto: CreateAuditDto): Promise<Audit> {
    const audit = this.auditRepository.create(createAuditDto);
    return this.auditRepository.save(audit);
  }

  async findAll(pagination: PaginationDto): Promise<Audit[]> {
    const { limit = 10, offset = 0 } = pagination;
    const audits = await this.auditRepository.find({
      take: limit,
      skip: offset,
    });
    if (audits.length == 0) {
      throw new NotContentException('No audits found');
    }
    return audits;
  }

  async findOne(id: number): Promise<Audit> {
    const audit: Audit = await this.auditRepository.findOneBy({ id });
    if (!audit) {
      throw new NotContentException('No audit found');
    }
    return audit;
  }
}
