import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditInterface } from '../interfaces/audit.interface';
import { Repository } from 'typeorm';
import { Audit } from '../audit/entities/audit.entity';
import { AuditService } from '../audit/audit.service';
import { CreateAuditDto } from '../audit/dto/create-audit.dto';

@Injectable()
export class PostRequestInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const ip =
      request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.connection.socket.remoteAddress;

    const audit: CreateAuditDto = new CreateAuditDto();
    audit.request = JSON.stringify(request.body);
    audit.method = request.method;
    audit.uri = request.originalUrl;
    audit.status = response.statusCode;
    audit.createdAt = new Date().toDateString();
    audit.user = request.user.username;
    audit.ip = ip;
    audit.error = '';

    return next.handle().pipe(
      tap(() => {
        this.auditService.create(audit).finally();
      }),
      catchError((err) => {
        audit.error = err.message;
        audit.status = err.status || 500;
        this.auditService.create(audit).finally();
        throw err;
      }),
    );
  }
}
