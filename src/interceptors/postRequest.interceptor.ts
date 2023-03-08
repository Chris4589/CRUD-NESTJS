import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../audit/audit.service';
import { CreateAuditDto } from '../audit/dto/create-audit.dto';
import { BunyanLogger } from '../commons/bunyan-logger';
import { Log } from '../interfaces/log.interface';

@Injectable()
export class PostRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly bunyanLogger: BunyanLogger,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

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
    audit.user = request.user?.username;
    audit.ip = ip;
    audit.error = '';

    const log: Log = {
      apiKey: request.headers.authorization,
      uri: request.originalUrl,
      responseCode: response.statusCode,
      responseTime: 0,
      clientIp: ip,
      time: new Date().toDateString(),
    };

    return next.handle().pipe(
      tap(() => {
        this.auditService.create(audit).finally();
        log.responseTime = Date.now() - now;
        this.bunyanLogger.logInfo(log, PostRequestInterceptor.name, 'Ok');
      }),
      catchError((err) => {
        audit.error = err.message;
        audit.status = err.status || 500;
        log.responseTime = Date.now() - now;
        log.responseCode = audit.status;
        this.bunyanLogger.logError(
          log,
          PostRequestInterceptor.name,
          err.message,
        );
        this.auditService.create(audit).finally();
        throw err;
      }),
    );
  }
}
