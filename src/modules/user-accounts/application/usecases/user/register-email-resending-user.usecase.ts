import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../../constants/texts';
import { EAuthValidationField } from '../../../constants/errors';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserRegistrationEmailResendingInputDto } from '../../input-dto/user/user-registration-email-resending.input-dto';
import { UserRegisteredEmailResendingEvent } from '../../../domain/events/user-registered-email-resending.event';

export class RegisterEmailResendingUserCommand {
  constructor(public dto: UserRegistrationEmailResendingInputDto) {}
}

@CommandHandler(RegisterEmailResendingUserCommand)
export class RegisterEmailResendingUserUseCase implements ICommandHandler<
  RegisterEmailResendingUserCommand,
  boolean
> {
  constructor(
    private eventBus: EventBus,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: RegisterEmailResendingUserCommand): Promise<boolean> {
    const { email } = dto;

    const user = await this.usersRepository.findUserByLoginOrEmail(email);

    if (!user) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.emailResending,
        extensions: [
          {
            field: EAuthValidationField.EMAIL,
            message: errorMessages.emailResending,
          },
        ],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.updateIsConfirmedInEmailResending,
        extensions: [
          {
            field: EAuthValidationField.EMAIL,
            message: errorMessages.updateIsConfirmedInEmailResending,
          },
        ],
      });
    }

    const updatedUser = user.updateRegistrationConfirmationCode();

    this.eventBus.publish(
      new UserRegisteredEmailResendingEvent(
        email,
        updatedUser.emailConfirmation.confirmationCode || '',
      ),
    );

    await this.usersRepository.save(updatedUser);

    return true;
  }
}
