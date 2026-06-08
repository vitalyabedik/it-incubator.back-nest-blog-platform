import { Injectable } from '@nestjs/common';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../../config/config-validation.utility';

@Injectable()
export class MailerConfig implements MailerOptionsFactory {
  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message: `Нужно установить postService для mailer module`,
  })
  postService: string = this.configService.get('POST_SERVICE');

  @IsNotEmpty({
    message: `Нужно установить email для mailer module`,
  })
  email: string = this.configService.get('EMAIL');

  @IsNotEmpty({
    message: `Нужно установить emailPassword для mailer module`,
  })
  emailPassword: string = this.configService.get('EMAIL_PASS');

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        service: 'gmail',
        auth: { user: this.email, pass: this.emailPassword },
      },
      defaults: {
        from: `"Registration" <${this.email}>`,
      },
    };
  }
}
