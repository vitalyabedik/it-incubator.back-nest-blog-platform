import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserPasswordRecoveryEvent } from '../../../user-accounts/domain/events/user-password-recovery.event';
import { EmailService } from '../email.service';

@EventsHandler(UserPasswordRecoveryEvent)
export class SendPasswordRecoveryCodeEventHandler implements IEventHandler<UserPasswordRecoveryEvent> {
  constructor(private emailService: EmailService) {}

  async handle(event: UserPasswordRecoveryEvent) {
    try {
      const { email, recoveryCode } = event;

      await this.emailService.sendPasswordRecoveryCode({
        email,
        recoveryCode,
      });
    } catch (e) {
      console.error('Отправка recoveryCode', e);
    }
  }
}
