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

@Injectable()
export class PostRequestInterceptor implements NestInterceptor {
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const ip =
      request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.connection.socket.remoteAddress;

    const audit: AuditInterface = {
      request: JSON.stringify(request.body),
      method: request.method,
      uri: request.originalUrl,
      status: response.statusCode,
      createdAt: new Date(),
      user: request.user.username,
      ip,
      error: '',
    };

    return next.handle().pipe(
      tap(() => {
        console.log(audit);
      }),
      catchError((err) => {
        audit.error = err.message;
        audit.status = err.status || 500;
        throw err;
      }),
    );
  }
}
