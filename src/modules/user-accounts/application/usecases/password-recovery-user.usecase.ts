import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { TUserDocument } from '../../domain/user.entity';
import { UsersRepository } from '../../infrastructure/users.repository';
import { FindUserByLoginOrEmailQuery } from '../queries/find-user-by-login-or-email.query-handler';
import { UserPasswordRecoveryInputDto } from '../input-dto/user-password-recovery.input-dto';
import { UserPasswordRecoveryEvent } from '../../domain/events/user-password-recovery.event';

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
    private readonly queryBus: QueryBus,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: PasswordRecoveryUserCommand): Promise<boolean> {
    const { email } = dto;

    const user = await this.queryBus.execute<
      FindUserByLoginOrEmailQuery,
      TUserDocument | null
    >(new FindUserByLoginOrEmailQuery(email));
    if (!user) return false;

    const recoveryCode = user.setPasswordRecoveryData();

    await this.usersRepository.save(user);

    this.eventBus.publish(new UserPasswordRecoveryEvent(email, recoveryCode));

    return true;
  }
}
