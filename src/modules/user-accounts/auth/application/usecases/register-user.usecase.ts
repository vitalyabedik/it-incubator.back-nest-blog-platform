import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRegistrationInputDto } from '../../../auth/application/input-dto/user-registration.input-dto';
import { UsersFactory } from '../../../users/application/factories/users.factory';
import { UsersService } from '../../../users/application/services/users.service';
import { UserRegisteredEvent } from '../events/user-registered.event';

export class RegisterUserCommand {
  constructor(public dto: UserRegistrationInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<
  RegisterUserCommand,
  boolean
> {
  constructor(
    private eventBus: EventBus,
    private userService: UsersService,
    private usersFactory: UsersFactory,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<boolean> {
    await this.userService.checkIsUserExists(dto);

    const { user, confirmationCode } =
      await this.usersFactory.createUnconfirmedUser(dto);

    this.eventBus.publish(
      new UserRegisteredEvent(user.email, confirmationCode),
    );

    return true;
  }
}
