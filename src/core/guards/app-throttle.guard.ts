import { Injectable } from '@nestjs/common';
import {
  ThrottlerGuard,
  type ThrottlerModuleOptions,
  ThrottlerRequest,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { EDomainExceptionCode } from '../exceptions/domain-exception-codes';
import { DomainException } from '../exceptions/domain-exceptions';
import { Reflector } from '@nestjs/core';

const DEFAULT_THROTTLE_OPTIONS = {
  limit: 5,
  ttl: 10_000,
};

export const APP_THROTTLE_META_KEY = 'app_throttle';
const TOO_MANY_REQUESTS_ERROR_MESSAGE = 'Слишком много запросов';

@Injectable()
export class AppThrottleGuard extends ThrottlerGuard {
  constructor(
    protected readonly options: ThrottlerModuleOptions,
    protected readonly storageService: ThrottlerStorage,
    protected readonly reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  protected async throwThrottlingException(): Promise<void> {
    throw new DomainException({
      code: EDomainExceptionCode.TooManyRequests,
      message: TOO_MANY_REQUESTS_ERROR_MESSAGE,
    });
  }

  protected async handleRequest(
    requestProps: ThrottlerRequest,
  ): Promise<boolean> {
    const customConfig = this.reflector.getAllAndOverride(
      APP_THROTTLE_META_KEY,
      [requestProps.context.getHandler(), requestProps.context.getClass()],
    );

    const { limit, ttl } = {
      ...DEFAULT_THROTTLE_OPTIONS,
      ...(customConfig || {}),
    };

    if (customConfig) {
      return super.handleRequest({
        ...requestProps,
        limit,
        ttl,
      });
    }

    return super.handleRequest(requestProps);
  }
}
