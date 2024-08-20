import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      const request = ctx.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];

      if (typeof token !== 'string' || token === '') {
        throw new UnauthorizedException();
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      if (!payload) {
        throw new UnauthorizedException();
      }
      const userId = payload.userId;

      request.userId = userId;
      return true;
    } catch (error) {
      console.log(`authentication error - `, error);
      throw new ForbiddenException(error.message || 'invalid token');
    }
  }
}

@Injectable()
export class IsAuthorGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    if (request.params?.userId !== request?.userId) {
      throw new ForbiddenException(
        'you are not allowed to change this resource',
      );
    }
    return true;
  }
}
