import { applyDecorators, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../basic/basic-auth.guard';

export const UseBasicGuard = () => {
  return applyDecorators(UseGuards(BasicAuthGuard));
};
