import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotContentException } from '../exceptions/NotContentException';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConflictException } from '@nestjs/common';
import { JwtStrategy } from '../commons/jwt-strategys';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BunyanLogger } from '../commons/bunyan-logger';
import { PostRequestInterceptor } from '../interceptors/postRequest.interceptor';
import { MockLoggingInterceptor } from '../interceptors/mock.interceptor';

describe('AuthController', () => {
  let controller: AuthController;
  let repository: Repository<Auth>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        BunyanLogger,
        {
          provide: getRepositoryToken(Auth),
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
        // forwardRef(() => AuditModule),
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

    controller = module.get<AuthController>(AuthController);
    repository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
  });

  it('findAll - ok', () => {
    const user = new Auth();
    user.email = 'cherrera@is4tech.com';
    jest.spyOn(repository, 'find').mockResolvedValueOnce([user]);

    expect(controller.findAll()).resolves.toEqual([user]);
  });

  it('findAll - error', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

    controller
      .findAll()
      .then(() => expect(true).toBe(false))
      .catch((e) => expect(e).toBeInstanceOf(NotContentException));
  });

  it('findOne - ok', () => {
    const user = new Auth();
    user.email = 'cherrera@is4tech.com';
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(user);

    expect(controller.findOne(1)).resolves.toEqual(user);
  });

  it('findOne - error', () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined);

    controller
      .findOne(1)
      .then(() => expect(true).toBe(false))
      .catch((e) => expect(e).toBeInstanceOf(NotContentException));
  });

  it('delete - ok', () => {
    const user = new Auth();
    user.email = 'cherrera@is4tech.com';
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(user);
    jest.spyOn(repository, 'remove').mockResolvedValueOnce(user);

    expect(controller.remove(1)).resolves.toEqual(user);
  });

  it('create - ok', () => {
    const user = new Auth();
    user.email = 'cherrera@is4tech.com';
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(user);

    const dto = new CreateAuthDto();
    dto.role = ['admin'];
    expect(controller.create(dto)).resolves.toEqual(user);
  });

  it('create - error', () => {
    const user = new Auth();
    user.email = 'cherrera@is4tech.com';
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

    controller
      .create(new CreateAuthDto())
      .then(() => expect(true).toBe(false))
      .catch((e) => expect(e).toBeInstanceOf(ConflictException));
  });

  it('update - ok', () => {
    const user = new Auth();
    user.email = 'cherrera@is4tech.com';
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(user);
    jest.spyOn(repository, 'preload').mockResolvedValueOnce(user);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(user);

    const dto = new CreateAuthDto();
    dto.role = ['admin'];
    expect(controller.update(1, dto)).resolves.toEqual(user);
  });
});
