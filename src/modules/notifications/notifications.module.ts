import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './application/email.service';
import { EmailTemplates } from './application/email.templates';
import { SendEmailResendingWhenUserRegisteredEventHandler } from './application/event-handlers/send-email-resending-when-user-registered.event-handler';
import { SendConfirmationEmailWhenUserRegisteredEventHandler } from './application/event-handlers/send-confirmation-email-when-user-registered.event-handler';
import { SendPasswordRecoveryCodeEventHandler } from './application/event-handlers/send-password-recovery-code.event-handler';
import { MailerConfig } from './config/mailer.config';

const eventHandlers = [
  SendConfirmationEmailWhenUserRegisteredEventHandler,
  SendEmailResendingWhenUserRegisteredEventHandler,
  SendPasswordRecoveryCodeEventHandler,
];

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfig,
    }),
  ],
  providers: [EmailService, EmailTemplates, ...eventHandlers],
  exports: [EmailService],
})
export class NotificationsModule {}
