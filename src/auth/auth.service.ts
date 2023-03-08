import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotContentException } from '../exceptions/NotContentException';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseInterface } from '../interfaces/login-response.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    private readonly jwtService: JwtService,
  ) {}
  async create(createAuthDto: CreateAuthDto): Promise<Auth> {
    const userExists = await this.authRepository.findOne({
      where: { email: createAuthDto.email },
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const user = Auth.fromCreateAuthDto(createAuthDto);
    return await this.authRepository.save(user);
  }
  async login(loginDto: LoginDto): Promise<LoginResponseInterface> {
    const user = await this.authRepository.findOneBy({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = this.jwtService.sign({
      email: user.email,
      userId: user.id,
      username: user.username,
    });
    delete user.password;
    return {
      user,
      token,
    };
  }

  async findAll(): Promise<Auth[]> {
    const users = await this.authRepository.find();
    if (users.length === 0) {
      throw new NotContentException('No users found');
    }
    return users;
  }

  async findOne(id: number): Promise<Auth> {
    const user = await this.authRepository.findOneBy({ id });
    if (!user) {
      throw new NotContentException('No user found');
    }
    return user;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto): Promise<Auth> {
    const user = await this.findOne(id);
    const parseUser = await this.authRepository.preload({
      id,
      ...Auth.fromUpdateAuthDto({
        ...updateAuthDto,
        email: user.email,
      }),
    });
    return await this.authRepository.save(parseUser);
  }

  async remove(id: number): Promise<Auth> {
    const user = await this.findOne(id);
    return await this.authRepository.remove(user);
  }
}
