import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { EmailService } from './application/email.service';
import { EmailTemplates } from './application/email.templates';
import { UserRegisteredEmailResendingEvent } from '../user-accounts/domain/events/user-registered-email-resending.event';
import { SendConfirmationEmailWhenUserRegisteredEventHandler } from './application/event-handlers/send-confirmation-email-when-user-registered.event-handler';
import { SendPasswordRecoveryCodeEventHandler } from './application/event-handlers/send-password-recovery-code.event-handler';

const eventHandlers = [
  SendConfirmationEmailWhenUserRegisteredEventHandler,
  UserRegisteredEmailResendingEvent,
  SendPasswordRecoveryCodeEventHandler,
];

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const postService = configService.get('POST_SERVICE');
        const email = configService.get('EMAIL');
        const emailPass = configService.get('EMAIL_PASS');

        return {
          transport: {
            service: postService,
            auth: { user: email, pass: emailPass },
          },
          defaults: { from: `"Registration" <${email}>` },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService, EmailTemplates, ...eventHandlers],
  exports: [EmailService],
})
export class NotificationsModule {}
