import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { pipesSetup } from './pipes.setup';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';

export function appSetup(
  app: NestExpressApplication,
  isSwaggerEnabled: boolean,
) {
  app.enableCors();
  app.set('trust proxy', 'loopback');
  app.use(cookieParser());
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app, isSwaggerEnabled);
}
