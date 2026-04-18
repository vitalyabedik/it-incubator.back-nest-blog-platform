import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from '../../../../core/constants/tokens';
import { AccessTokenPayload } from './bearer-auth.guard';

@Injectable()
export class OptionalBearerAuthGuard implements CanActivate {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (token) {
      try {
        const secret = this.configService.getOrThrow<string>('AC_SECRET');

        const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
          token,
          { secret },
        );

        request['user'] = payload;
      } catch {
        return true;
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') || [];

    return type === 'Bearer' ? token : undefined;
  }
}
