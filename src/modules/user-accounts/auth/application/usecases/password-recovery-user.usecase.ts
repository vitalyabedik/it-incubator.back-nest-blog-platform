import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UserPasswordRecoveryInputDto } from '../../../auth/application/input-dto/user-password-recovery.input-dto';
import { UserPasswordRecoveryEvent } from '../events/user-password-recovery.event';

export class PasswordRecoveryUserCommand {
  constructor(public dto: UserPasswordRecoveryInputDto) {}
}

@CommandHandler(PasswordRecoveryUserCommand)
export class PasswordRecoveryUserUseCase implements ICommandHandler<
  PasswordRecoveryUserCommand,
  boolean
> {
  constructor(
    private eventBus: EventBus,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: PasswordRecoveryUserCommand): Promise<boolean> {
    const { email } = dto;

    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user) return false;

    const recoveryCode = randomUUID();
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersRepository.updatePasswordRecoveryData({
      userId: user.id,
      code: recoveryCode,
      expirationDate,
    });

    this.eventBus.publish(new UserPasswordRecoveryEvent(email, recoveryCode));

    return true;
  }
}
