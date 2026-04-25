import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GLOBAL_PREFIX } from './global-prefix.setup';

const SWAGGER_API_TITLE = 'BLOGGER API';
const SWAGGER_SITE_TITLE = 'Blogger Swagger';

export function swaggerSetup(app: INestApplication, isSwaggerEnabled: boolean) {
  if (!isSwaggerEnabled) return;

  const config = new DocumentBuilder()
    .setTitle(SWAGGER_API_TITLE)
    .addBearerAuth()
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
      },
      'basicAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(GLOBAL_PREFIX, app, document, {
    customSiteTitle: SWAGGER_SITE_TITLE,
  });
}
