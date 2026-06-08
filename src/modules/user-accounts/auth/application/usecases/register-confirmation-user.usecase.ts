import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UserRegistrationConfirmationInputDto } from '../../../auth/application/input-dto/user-registration-confirmation.input-dto';
import { EAuthValidationField } from '../../constants/errors';

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

    const isUpdating =
      await this.usersRepository.confirmRegistrationByCode(code);

    if (!isUpdating) {
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

    return true;
  }
}
