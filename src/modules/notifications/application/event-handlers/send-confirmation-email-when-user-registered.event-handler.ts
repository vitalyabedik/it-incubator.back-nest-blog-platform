import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../../../user-accounts/domain/events/user-registered.event';
import { EmailService } from '../email.service';

@EventsHandler(UserRegisteredEvent)
export class SendConfirmationEmailWhenUserRegisteredEventHandler implements IEventHandler<UserRegisteredEvent> {
  constructor(private emailService: EmailService) {}

  async handle(event: UserRegisteredEvent) {
    try {
      const { email, confirmationCode } = event;

      await this.emailService.sendRegistrationConfirmationCode({
        email,
        confirmationCode,
      });
    } catch (e) {
      console.error('Отправка email', e);
    }
  }
}
