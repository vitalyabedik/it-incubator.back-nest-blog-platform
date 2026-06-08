import { applyDecorators, UseGuards } from '@nestjs/common';
import { OptionalBearerAuthGuard } from '../bearer/optional-bearer-auth.guard';

export const UseOptionalBearerGuard = () => {
  return applyDecorators(UseGuards(OptionalBearerAuthGuard));
};
