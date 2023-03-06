import { Controller, Get, Param, ParseIntPipe, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PaginationDto } from '../commons/dto/pagination.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostRequestInterceptor } from '../interceptors/postRequest.interceptor';
import { AuthGuard } from '@nestjs/passport';

@Controller('audit')
@ApiTags('audit')
@ApiBearerAuth('access-token')
@UseInterceptors(PostRequestInterceptor)
@UseGuards(AuthGuard())
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.auditService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditService.findOne(id);
  }
}
