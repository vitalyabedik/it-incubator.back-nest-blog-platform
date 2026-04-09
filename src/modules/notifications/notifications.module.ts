import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { EmailTemplates } from './email.templates';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: process.env.POST_SERVICE,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: 'Registration <codeSender>',
      },
    }),
  ],
  providers: [EmailService, EmailTemplates],
  exports: [EmailService],
})
export class NotificationsModule {}
