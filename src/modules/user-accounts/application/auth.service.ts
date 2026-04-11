import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { EmailService } from '../../notifications/email.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { TUserModel, User } from '../domain/user.entity';
import { errorMessages, errorMessageVariant } from '../constants/texts';
import {
  EAuthValidationField,
  EUserValidationField,
} from '../constants/errors';
import { CryptoService } from './crypto.service';
import { TokenService } from './token.service';
import { UserLoginInputDto } from './input-dto/user-login.input-dto';
import { UserRegistrationInputDto } from './input-dto/user-registration.input-dto';
import { UserRegistrationConfirmationInputDto } from './input-dto/user-registration-confirmation.input-dto';
import { UserRegistrationEmailResendingInputDto } from './input-dto/user-registration-email-resending.input-dto';
import { UserPasswordRecoveryInputDto } from './input-dto/user-password-recovery.input-dto';
import { UserNewPasswordInputDto } from './input-dto/user-new-password.input-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: TUserModel,
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private tokenService: TokenService,
    private emailService: EmailService,
  ) {}

  async login(dto: UserLoginInputDto): Promise<{ accessToken: string } | null> {
    const user = await this.validateUser(dto);

    if (!user) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    const accessToken = await this.tokenService.createAccessToken(user);

    return { accessToken };
  }

  async registration(dto: UserRegistrationInputDto): Promise<boolean> {
    const { login, password, email } = dto;

    const userExistenceCheck = await this.UserModel.checkIsUserExist(dto);

    if (userExistenceCheck.isExist) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.uniqueUser,
        extensions: [
          {
            field: userExistenceCheck.field as EUserValidationField,
            message: errorMessageVariant.credentials,
          },
        ],
      });
    }

    const passwordHash = await this.cryptoService.createPasswordHash(password);

    const createdUser = await this.UserModel.createUnconfirmedInstance({
      login: login,
      email: email,
      passwordHash,
    });

    this.emailService.sendRegistrationConfirmationCode({
      email,
      confirmationCode: createdUser.emailConfirmation.confirmationCode || '',
    });

    await this.usersRepository.save(createdUser);

    return true;
  }

  async registrationConfirmation(
    dto: UserRegistrationConfirmationInputDto,
  ): Promise<boolean> {
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

  async registrationEmailResending(
    dto: UserRegistrationEmailResendingInputDto,
  ): Promise<boolean> {
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

    this.emailService.sendRegistrationConfirmationCode({
      email,
      confirmationCode: updatedUser.emailConfirmation.confirmationCode || '',
    });

    await this.usersRepository.save(updatedUser);

    return true;
  }

  async passwordRecovery(dto: UserPasswordRecoveryInputDto): Promise<boolean> {
    const { email } = dto;

    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user) return false;

    const recoveryCode = user.setPasswordRecoveryData();

    await this.usersRepository.save(user);

    this.emailService.sendPasswordRecoveryCode({
      email,
      recoveryCode,
    });

    return true;
  }

  async newPassword(dto: UserNewPasswordInputDto): Promise<boolean> {
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

  async validateUser(dto: UserLoginInputDto) {
    const { loginOrEmail, password } = dto;

    console.log('🔍 Searching for user:', loginOrEmail);

    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      console.log('❌ User not found');
      return null;
    }

    console.log('✅ User found:', {
      id: user.id,
      login: user.login,
      email: user.email,
      isConfirmed: user.emailConfirmation.isConfirmed,
      passwordHashPrefix: user.passwordHash.substring(0, 20) + '...',
      deletedAt: user.deletedAt,
    });

    const isValidPassword = await this.cryptoService.comparePasswords({
      password,
      hash: user.passwordHash,
    });
    console.log('🔐 Password valid:', isValidPassword);
    if (!isValidPassword) {
      console.log(
        '❌ Invalid password. Provided:',
        password,
        'Hash:',
        user.passwordHash,
      );
      return null;
    }

    return {
      userId: user.id.toString(),
      login: user.login,
      email: user.email,
    };
  }
}
