import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { UserFromRequestDataInputDto } from '../../api/input-dto/user-from-request-data-input.dto';
import { errorMessages } from '../../constants/texts';

export interface AccessTokenPayload extends UserFromRequestDataInputDto {}

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    try {
      const secret = this.configService.getOrThrow<string>('AC_SECRET');

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
