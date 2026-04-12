import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEmailResendingEvent } from '../../../user-accounts/domain/events/user-registered-email-resending.event';
import { EmailService } from '../email.service';

@EventsHandler(UserRegisteredEmailResendingEvent)
export class SendEmailResendingWhenUserRegisteredEventHandler implements IEventHandler<UserRegisteredEmailResendingEvent> {
  constructor(private emailService: EmailService) {}

  async handle(event: UserRegisteredEmailResendingEvent) {
    try {
      const { email, confirmationCode } = event;

      await this.emailService.sendRegistrationConfirmationCode({
        email,
        confirmationCode,
      });
    } catch (e) {
      console.error('Повторная отправка email', e);
    }
  }
}
