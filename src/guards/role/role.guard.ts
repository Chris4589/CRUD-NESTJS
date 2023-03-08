import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Auth } from '../../auth/entities/auth.entity';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permitRoles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );
    if (!permitRoles || permitRoles.length === 0) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as Auth;

    if (!user) {
      throw new UnauthorizedException();
    }
    return user.role
      ?.split(',')
      .some((role: string) => permitRoles.includes(role));
  }
}
