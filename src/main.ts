import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appSetup } from './setup/app.setup';
import { initAppModule } from './init-app-module';
import { CoreConfig } from './core/config/core.config';

async function bootstrap() {
  const DynamicAppModule = await initAppModule();

  const app =
    await NestFactory.create<NestExpressApplication>(DynamicAppModule);

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  appSetup(app, coreConfig.isSwaggerEnabled);

  const port = coreConfig.port;

  await app.listen(port, () => {
    console.log('App starting listen port: ', port);
    console.log('NODE_ENV: ', coreConfig.env);
  });
}

bootstrap();
