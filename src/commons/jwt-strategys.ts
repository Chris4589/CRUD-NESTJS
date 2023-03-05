import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenInterface } from '../interfaces/token.interface';
import { Auth } from '../auth/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SERVER_SECRET,
    });
  }

  async validate(payload: TokenInterface) {
    const user = await this.authRepository.findOneBy({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
