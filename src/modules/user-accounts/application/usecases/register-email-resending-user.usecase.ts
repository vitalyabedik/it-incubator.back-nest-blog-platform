import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { TUserDocument } from '../../domain/user.entity';
import { EAuthValidationField } from '../../constants/errors';
import { UsersRepository } from '../../infrastructure/users.repository';
import { FindUserByLoginOrEmailQuery } from '../queries/find-user-by-login-or-email.query-handler';
import { UserRegistrationEmailResendingInputDto } from '../input-dto/user-registration-email-resending.input-dto';
import { UserRegisteredEmailResendingEvent } from '../../domain/events/user-registered-email-resending.event';

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
    private readonly queryBus: QueryBus,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: RegisterEmailResendingUserCommand): Promise<boolean> {
    const { email } = dto;

    const user = await this.queryBus.execute<
      FindUserByLoginOrEmailQuery,
      TUserDocument | null
    >(new FindUserByLoginOrEmailQuery(email));

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
