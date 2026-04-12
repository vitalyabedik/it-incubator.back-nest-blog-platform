import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { TUserDocument, User } from '../../domain/user.entity';
import { EAuthValidationField } from '../../constants/errors';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserRegistrationConfirmationInputDto } from '../input-dto/user-registration-confirmation.input-dto';
import { FindUserByConfirmationCodeQuery } from '../queries/find-user-by-confirmation-code.query-handler';

export class RegisterConfirmationUserCommand {
  constructor(public dto: UserRegistrationConfirmationInputDto) {}
}

@CommandHandler(RegisterConfirmationUserCommand)
export class RegisterConfirmationUserUseCase implements ICommandHandler<
  RegisterConfirmationUserCommand,
  boolean
> {
  constructor(
    @InjectModel(User.name)
    private usersRepository: UsersRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ dto }: RegisterConfirmationUserCommand): Promise<boolean> {
    const { code } = dto;

    const user = await this.queryBus.execute<
      FindUserByConfirmationCodeQuery,
      TUserDocument | null
    >(new FindUserByConfirmationCodeQuery(code));

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
