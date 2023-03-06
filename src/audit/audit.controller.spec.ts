import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../commons/dto/pagination.dto';
import { JwtStrategy } from '../commons/jwt-strategys';
import { BunyanLogger } from '../commons/bunyan-logger';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PostRequestInterceptor } from '../interceptors/postRequest.interceptor';
import { MockLoggingInterceptor } from '../interceptors/mock.interceptor';

describe('AuditController', () => {
  let controller: AuditController;
  let auditRepository: Repository<Audit>;
  let audit: Audit;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(Audit),
          useClass: Repository,
        },
        {
          provide: JwtStrategy,
          useValue: {
            sign: jest.fn(() => 'mock-token'),
            verify: jest.fn(() => ({ id: 1 })),
            validate: jest.fn(() => ({ id: 1 })),
          },
        },
        {
          provide: BunyanLogger,
          useValue: {
            logError: jest.fn(),
            logInfo: jest.fn(),
          },
        },
      ],
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [],
          inject: [],
          useFactory: () => ({
            secret: '1',
            signOptions: { expiresIn: '3h' },
          }),
        }),
      ],
    })
      .overrideInterceptor(PostRequestInterceptor)
      .useClass(MockLoggingInterceptor)
      .compile();

    controller = module.get<AuditController>(AuditController);
    auditRepository = module.get<Repository<Audit>>(getRepositoryToken(Audit));

    audit = new Audit();
  });

  it('findAll - ok', () => {
    jest.spyOn(auditRepository, 'find').mockResolvedValueOnce([audit]);
    expect(controller.findAll(new PaginationDto())).resolves.toEqual([audit]);
  });

  it('findAll - error', () => {
    jest.spyOn(auditRepository, 'find').mockResolvedValueOnce([]);
    expect(controller.findAll(new PaginationDto())).rejects.toThrow(
      'No audits found',
    );
  });

  it('findOne - ok', () => {
    jest.spyOn(auditRepository, 'findOneBy').mockResolvedValueOnce(audit);
    expect(controller.findOne(1)).resolves.toEqual(audit);
  });

  it('findOne - error', () => {
    jest.spyOn(auditRepository, 'findOneBy').mockResolvedValueOnce(undefined);
    expect(controller.findOne(1)).rejects.toThrow('No audit found');
  });
});
