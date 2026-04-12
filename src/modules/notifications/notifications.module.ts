import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
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
  providers: [EmailService, EmailTemplates, ...eventHandlers],
  exports: [EmailService],
})
export class NotificationsModule {}
