import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/users.repository';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { UserLoginInputDto } from '../../../auth/application/input-dto/user-login.input-dto';
import { CryptoService } from '../../../auth/application/services/crypto.service';
import { errorMessages, errorMessageVariant } from '../../constants/texts';
import { EUserValidationField } from '../../constants/errors';

@Injectable()
export class UsersService {
  constructor(
    private cryptoService: CryptoService,
    private usersRepository: UsersRepository,
  ) {}

  async validateUserCredentials(dto: UserLoginInputDto) {
    const { loginOrEmail, password } = dto;

    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const isValidPassword = await this.cryptoService.comparePasswords({
      password,
      hash: user.passwordHash,
    });
    if (!isValidPassword) return null;

    return {
      userId: user.id.toString(),
      login: user.login,
      email: user.email,
    };
  }

  async checkIsUserEmailExists(email: string): Promise<void> {
    const user = await this.usersRepository.findUserByLoginOrEmail(email);

    if (user) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.uniqueEmail,
        extensions: [
          {
            field: EUserValidationField.EMAIL,
            message: errorMessageVariant.credentials,
          },
        ],
      });
    }
  }

  async checkIsUserExists({
    login,
    email,
  }: {
    login: string;
    email: string;
  }): Promise<void> {
    const userByLoginPromise =
      this.usersRepository.findUserByLoginOrEmail(login);
    const userByEmailPromise =
      this.usersRepository.findUserByLoginOrEmail(email);

    const [userByLogin, userByEmail] = await Promise.all([
      userByLoginPromise,
      userByEmailPromise,
    ]);

    const takenFields = [
      { field: EUserValidationField.LOGIN, isExist: userByLogin },
      { field: EUserValidationField.EMAIL, isExist: userByEmail },
    ].filter((el) => Boolean(el.isExist));

    if (takenFields.length > 0) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.uniqueUser,
        extensions: takenFields.map((el) => ({
          field: el.field,
          message: `${el.field} ${errorMessages.uniqueUserField}`,
        })),
      });
    }
  }
}
