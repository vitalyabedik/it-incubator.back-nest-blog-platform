import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';

const PORT = process.env.PORT || 5005;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  appSetup(app);

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();
