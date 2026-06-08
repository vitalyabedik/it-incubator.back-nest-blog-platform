import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractOptionalUserFromRequest = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;
    if (!user) return null;

    return user;
  },
);
