import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly validUsername = process.env.ADMIN_USERNAME || 'admin';
  private readonly validPassword = process.env.ADMIN_PASSWORD || 'qwerty';

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic')) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    const credentials = authHeader.split(' ')[1];
    const originalBase64Credentials = btoa(
      `${this.validUsername}:${this.validPassword}`,
    );

    if (credentials !== originalBase64Credentials) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    return true;
  }
}
