import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserRegisteredEvent } from '../../../domain/events/user-registered.event';
import { UserRegistrationInputDto } from '../../input-dto/user/user-registration.input-dto';
import { UsersFactory } from '../../factories/users.factory';

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
    private usersRepository: UsersRepository,
    private usersFactory: UsersFactory,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<boolean> {
    const { email } = dto;

    const createdUser = await this.usersFactory.createUnconfirmedUser(dto);

    this.eventBus.publish(
      new UserRegisteredEvent(
        email,
        createdUser.emailConfirmation.confirmationCode || '',
      ),
    );

    await this.usersRepository.save(createdUser);

    return true;
  }
}
