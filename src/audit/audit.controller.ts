import { Controller, Get, Param, ParseIntPipe, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PaginationDto } from '../commons/dto/pagination.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostRequestInterceptor } from '../interceptors/postRequest.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { IncludeRoles } from '../decorators/role.decorator';
import { ROLES } from '../interfaces/roles.enum';
import { RoleGuard } from '../guards/role/role.guard';

@Controller('audit')
@ApiTags('audit')
@ApiBearerAuth('access-token')
@IncludeRoles(ROLES.ADMIN)
@UseGuards(AuthGuard(), RoleGuard)
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
