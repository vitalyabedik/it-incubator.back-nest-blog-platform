import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from '../../../../core/constants/tokens';
import { UserFromRequestDataInputDto } from '../../api/input-dto/user-from-request-data-input.dto';
import { errorMessages } from '../../constants/texts';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserAccountsConfig } from '../../config/user-accounts.config';

export interface AccessTokenPayload extends UserFromRequestDataInputDto {}

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userAccountsConfig: UserAccountsConfig,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    try {
      const secret = this.userAccountsConfig.accessTokenSecret;

      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        { secret },
      );

      request['user'] = payload;
    } catch {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') || [];

    return type === 'Bearer' ? token : undefined;
  }
}
