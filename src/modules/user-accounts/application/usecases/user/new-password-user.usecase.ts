import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserNewPasswordInputDto } from '../../input-dto/user/user-new-password.input-dto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../../constants/texts';
import { EAuthValidationField } from '../../../constants/errors';
import { CryptoService } from '../../crypto.service';

export class NewPasswordUserCommand {
  constructor(public dto: UserNewPasswordInputDto) {}
}

@CommandHandler(NewPasswordUserCommand)
export class NewPasswordUserUseCase implements ICommandHandler<
  NewPasswordUserCommand,
  boolean
> {
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute({ dto }: NewPasswordUserCommand): Promise<boolean> {
    const { newPassword, recoveryCode } = dto;

    const user =
      await this.usersRepository.findUserByPasswordRecoveryCode(recoveryCode);

    if (!user) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.newPassword,
        extensions: [
          {
            field: EAuthValidationField.RECOVERY_CODE,
            message: errorMessages.newPassword,
          },
        ],
      });
    }

    const isValidCode = user.validatePasswordRecoveryCode(recoveryCode);

    if (!isValidCode) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.newPassword,
        extensions: [
          {
            field: EAuthValidationField.RECOVERY_CODE,
            message: errorMessages.newPassword,
          },
        ],
      });
    }

    const passwordHash =
      await this.cryptoService.createPasswordHash(newPassword);

    const updatedUser = user.updatePassword(passwordHash);

    await this.usersRepository.save(updatedUser);

    return true;
  }
}
