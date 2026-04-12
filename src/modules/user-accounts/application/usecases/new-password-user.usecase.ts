import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { TUserDocument, User } from '../../domain/user.entity';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserNewPasswordInputDto } from '../input-dto/user-new-password.input-dto';
import { FindUserByPasswordRecoveryCodeQuery } from '../queries/find-user-by-password-recovery-code.query-handler';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { EAuthValidationField } from '../../constants/errors';
import { CryptoService } from '../crypto.service';

export class NewPasswordUserCommand {
  constructor(public dto: UserNewPasswordInputDto) {}
}

@CommandHandler(NewPasswordUserCommand)
export class NewPasswordUserUseCase implements ICommandHandler<
  NewPasswordUserCommand,
  boolean
> {
  constructor(
    @InjectModel(User.name)
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ dto }: NewPasswordUserCommand): Promise<boolean> {
    const { newPassword, recoveryCode } = dto;

    const user = await this.queryBus.execute<
      FindUserByPasswordRecoveryCodeQuery,
      TUserDocument | null
    >(new FindUserByPasswordRecoveryCodeQuery(recoveryCode));

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
