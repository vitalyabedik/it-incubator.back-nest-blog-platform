import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { errorMessages } from '../../../constants/texts';

export const ExtractUserFromRequest = createParamDecorator(
  (property: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new Error(errorMessages.notFound);
    }

    return property ? user[property] : user;
  },
);
