import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../../constants/texts';
import { EAuthValidationField } from '../../../constants/errors';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserRegistrationConfirmationInputDto } from '../../input-dto/user/user-registration-confirmation.input-dto';

export class RegisterConfirmationUserCommand {
  constructor(public dto: UserRegistrationConfirmationInputDto) {}
}

@CommandHandler(RegisterConfirmationUserCommand)
export class RegisterConfirmationUserUseCase implements ICommandHandler<
  RegisterConfirmationUserCommand,
  boolean
> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ dto }: RegisterConfirmationUserCommand): Promise<boolean> {
    const { code } = dto;

    const user = await this.usersRepository.findUserByConfirmationCode(code);

    if (!user) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.codeConfirmation,
        extensions: [
          {
            field: EAuthValidationField.CODE,
            message: errorMessages.codeConfirmation,
          },
        ],
      });
    }

    const isValidCode = user.validateRegistrationConfirmationCode(code);

    if (!isValidCode) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.codeConfirmation,
        extensions: [
          {
            field: EAuthValidationField.CODE,
            message: errorMessages.codeConfirmation,
          },
        ],
      });
    }

    const updatedUser = user.confirmRegistration();

    await this.usersRepository.save(updatedUser);

    return true;
  }
}
