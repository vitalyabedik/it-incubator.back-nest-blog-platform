import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { errorMessages, errorMessageVariant } from '../../constants/texts';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User, TUserDocument, TUserModel } from '../../domain/user.entity';
import { EUserValidationField } from '../../constants/errors';
import { CryptoService } from '../crypto.service';
import { CreateUserDomainDto } from '../../domain/dto/create-user.domain.dto';

@Injectable()
export class UsersFactory {
  constructor(
    @InjectModel(User.name)
    private UserModel: TUserModel,
    private readonly cryptoService: CryptoService,
  ) {}

  async createConfirmedUser(dto: CreateUserDto): Promise<TUserDocument> {
    await this.validateUserUniqueness(dto);

    const passwordHash = await this.createPasswordHash(dto);
    const user = this.createUserInstance(dto, passwordHash);

    return user;
  }

  async createUnconfirmedUser(dto: CreateUserDto): Promise<TUserDocument> {
    await this.validateUserUniqueness(dto);

    const passwordHash = await this.createPasswordHash(dto);
    const user = this.UserModel.createUnconfirmedInstance({
      ...dto,
      passwordHash,
    });

    return user;
  }

  private async createPasswordHash(dto: CreateUserDto) {
    const passwordHash = await this.cryptoService.createPasswordHash(
      dto.password,
    );

    return passwordHash;
  }

  private createUserInstance(dto: CreateUserDto, passwordHash: string) {
    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash,
    });

    return user;
  }

  private async validateUserUniqueness(
    dto: Omit<CreateUserDomainDto, 'passwordHash'>,
  ): Promise<void> {
    const existenceCheck = await this.UserModel.checkIsUserExist(dto);

    if (existenceCheck.isExist) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.uniqueUser,
        extensions: [
          {
            field: existenceCheck.field as EUserValidationField,
            message: errorMessageVariant.credentials,
          },
        ],
      });
    }
  }
}
