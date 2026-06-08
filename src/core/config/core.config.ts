import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from '../../config/config-validation.utility';

export enum EEnvironments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message: `Установите переменную окружения POSTGRES_DB, пример: my-postgres-db`,
  })
  postgresDB: string = String(this.configService.get('POSTGRES_DB'));

  @IsNotEmpty({
    message: `Установите переменную окружения POSTGRES_USER, example: my-postgres-user`,
  })
  postgresUser: string = String(this.configService.get('POSTGRES_USER'));

  @IsNotEmpty({
    message: `Установите переменную окружения POSTGRES_PASSWORD, example: my-postgres-password`,
  })
  postgresPassword: string = String(
    this.configService.get('POSTGRES_PASSWORD'),
  );

  @IsNumber(
    {},
    {
      message: `Установите переменную окружения POSTGRES_PORT, example: 3000`,
    },
  )
  postgresPort: number = Number(this.configService.get('POSTGRES_PORT'));

  @IsNumber(
    {},
    {
      message: 'Установите переменную окружения PORT, пример: 3000',
    },
  )
  port: number = Number(this.configService.get('PORT'));

  @IsNotEmpty({
    message:
      'Установите переменную окружения MONGO_URI, пример: mongodb://localhost:27017/my-app-local-db',
  })
  mongoURI: string = this.configService.get('MONGO_URI');

  @IsEnum(EEnvironments, {
    message:
      'Укажите корректное значение NODE_ENV, доступные значения: ' +
      configValidationUtility.getEnumValues(EEnvironments).join(', '),
  })
  env: string = this.configService.get('NODE_ENV');

  @IsBoolean({
    message:
      'Установите переменную окружения IS_SWAGGER_ENABLED для включения/отключения Swagger, пример: true, доступные значения: true, false',
  })
  isSwaggerEnabled = configValidationUtility.convertToBoolean(
    this.configService.get('IS_SWAGGER_ENABLED'),
  ) as boolean;

  @IsBoolean({
    message:
      'Установите переменную окружения INCLUDE_TESTING_MODULE для включения/отключения опасного для production модуля тестирования, пример: true, доступные значения: true, false, 0, 1',
  })
  includeTestingModule: boolean = configValidationUtility.convertToBoolean(
    this.configService.get('INCLUDE_TESTING_MODULE'),
  ) as boolean;

  @IsBoolean({
    message:
      'Установите переменную окружения SEND_INTERNAL_SERVER_ERROR_DETAILS для включения/отключения деталей внутренней ошибки сервера (сообщение и т.д.), пример: true, доступные значения: true, false, 0, 1',
  })
  sendInternalServerErrorDetails: boolean =
    configValidationUtility.convertToBoolean(
      this.configService.get('SEND_INTERNAL_SERVER_ERROR_DETAILS'),
    ) as boolean;
}
