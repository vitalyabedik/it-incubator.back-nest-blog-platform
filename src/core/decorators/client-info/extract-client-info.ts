import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class ClientInfoDto {
  ip: string;
  deviceName: string;
}

export const ExtractClientInfo = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): ClientInfoDto => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const headerDevice = request.headers['x-device-name'];
    const userAgent = request.headers['user-agent'];

    const deviceName =
      (Array.isArray(headerDevice) ? headerDevice[0] : headerDevice) ||
      (Array.isArray(userAgent) ? userAgent[0] : userAgent) ||
      'unknown-device';

    const ip = request.ip || request.socket.remoteAddress || 'unknown-ip';

    return { ip, deviceName };
  },
);
