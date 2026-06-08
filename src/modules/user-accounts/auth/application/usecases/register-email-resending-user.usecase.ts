import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UserRegistrationEmailResendingInputDto } from '../../../auth/application/input-dto/user-registration-email-resending.input-dto';
import { errorMessages } from '../../constants/texts';
import { EAuthValidationField } from '../../constants/errors';
import { UserRegisteredEmailResendingEvent } from '../events/user-registered-email-resending.event';

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

    const prevConfirmationData =
      await this.usersRepository.findRegistrationConfirmationData(user.id);

    if (!prevConfirmationData) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.updateIsConfirmedInEmailResending,
        extensions: [
          {
            field: EAuthValidationField.EMAIL,
            message: errorMessages.shouldRegister,
          },
        ],
      });
    }

    if (prevConfirmationData.isConfirmed) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.updateIsConfirmedInEmailResending,
        extensions: [
          {
            field: EAuthValidationField.EMAIL,
            message: errorMessages.alreadyConfirmed,
          },
        ],
      });
    }

    const confirmationCode = randomUUID();
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersRepository.updateRegistrationConfirmationData({
      userId: user.id,
      confirmationCode,
      expirationDate,
    });

    this.eventBus.publish(
      new UserRegisteredEmailResendingEvent(user.email, confirmationCode),
    );

    return true;
  }
}
