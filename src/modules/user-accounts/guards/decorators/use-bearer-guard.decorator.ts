import { applyDecorators, UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from '../bearer/bearer-auth.guard';

export const UseBearerGuard = () => {
  return applyDecorators(UseGuards(BearerAuthGuard));
};
