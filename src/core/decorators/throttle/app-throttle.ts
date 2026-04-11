import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ThrottlerOptions } from '@nestjs/throttler';
import {
  APP_THROTTLE_META_KEY,
  AppThrottleGuard,
} from '../../guards/app-throttle.guard';

export const AppThrottle = (options?: ThrottlerOptions) => {
  return applyDecorators(
    SetMetadata(APP_THROTTLE_META_KEY, options),
    UseGuards(AppThrottleGuard),
  );
};
