import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailTemplates } from './email.templates';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private emailTemplates: EmailTemplates,
  ) {}

  async sendRegistrationConfirmationCode(dto: {
    email: string;
    confirmationCode: string;
  }) {
    return this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Подтверждение регистрации',
        html: this.emailTemplates.registrationConfirmation(
          dto.confirmationCode,
        ),
      })
      .catch((err) => console.log(err));
  }

  async sendPasswordRecoveryCode(dto: { email: string; recoveryCode: string }) {
    return this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Восстановление пароля',
        html: this.emailTemplates.recoveryPassword(dto.recoveryCode),
      })
      .catch((err) => console.log(err));
  }
}
