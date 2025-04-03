import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from '../../utils/types';
import { CURRENT_USER_KEY } from '../../utils/constants';
import { UserType } from '../../utils/enum';
import { UsersService } from '../users.service';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly usersServices: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return false;

    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (!token || type !== 'Bearer') {
      throw new UnauthorizedException(
        'access token denied, no valid token provided',
      );
    }

    try {
      const payload: JwtPayloadType = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.usersServices.getCurrentUser(payload.id);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!roles.includes(user.role)) {
        throw new UnauthorizedException('You do not have permission to access this resource');
      }

      request[CURRENT_USER_KEY] = user;
      return true;

    } catch  {
      throw new UnauthorizedException('access token denied, invalid token');
    }
  }
}