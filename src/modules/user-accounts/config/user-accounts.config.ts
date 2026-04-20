import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../../config/config-validation.utility';

@Injectable()
export class UserAccountsConfig {
  @IsNotEmpty({
    message: 'Установите переменную окружения ADMIN_USERNAME',
  })
  adminUsername: string = this.configService.get('ADMIN_USERNAME');

  @IsNotEmpty({
    message: 'Установите переменную окружения ADMIN_PASSWORD',
  })
  adminPassword: string = this.configService.get('ADMIN_PASSWORD');

  @IsNotEmpty({
    message:
      'Установите переменную окружения ACCESS_TOKEN_SECRET, опасно для безопасности!',
  })
  accessTokenSecret: string = this.configService.get('ACCESS_TOKEN_SECRET');

  @IsNotEmpty({
    message:
      'Установите переменную окружения ACCESS_TOKEN_EXPIRE_IN, примеры: 1h, 5m, 2d',
  })
  accessTokenExpireIn: number = this.configService.get(
    'ACCESS_TOKEN_EXPIRE_IN',
  );

  @IsNotEmpty({
    message:
      'Установите переменную окружения REFRESH_TOKEN_SECRET, опасно для безопасности!',
  })
  refreshTokenSecret: string = this.configService.get('REFRESH_TOKEN_SECRET');

  @IsNotEmpty({
    message:
      'Установите переменную окружения REFRESH_TOKEN_EXPIRE_IN, примеры: 1h, 5m, 2d',
  })
  refreshTokenExpireIn: number = this.configService.get(
    'REFRESH_TOKEN_EXPIRE_IN',
  );

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
