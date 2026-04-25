import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserPasswordRecoveryInputDto } from '../../input-dto/user/user-password-recovery.input-dto';
import { UserPasswordRecoveryEvent } from '../../../domain/events/user-password-recovery.event';

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

    const recoveryCode = user.setPasswordRecoveryData();

    await this.usersRepository.save(user);

    this.eventBus.publish(new UserPasswordRecoveryEvent(email, recoveryCode));

    return true;
  }
}
