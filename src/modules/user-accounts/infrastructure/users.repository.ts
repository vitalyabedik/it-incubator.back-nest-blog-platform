import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { EDomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { TUserDocument, TUserModel, User } from '../domain/user.entity';
import { errorMessages } from '../constants/texts';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: TUserModel) {}

  async findUserById(id: string): Promise<TUserDocument> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!user) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return user;
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<TUserDocument | null> {
    const user = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      deletedAt: null,
    }).exec();

    return user;
  }

  async findByLoginOrEmailOrThrow(
    loginOrEmail: string,
  ): Promise<TUserDocument> {
    const user = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      deletedAt: null,
    }).exec();

    if (!user) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return user;
  }

  async findUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<TUserDocument | null> {
    const user = await this.UserModel.findOne({
      'emailConfirmation.confirmationCode': confirmationCode,
      deletedAt: null,
    }).exec();

    return user;
  }

  async findUserByPasswordRecoveryCode(code: string) {
    const user = await this.UserModel.findOne({
      'passwordRecovery.code': code,
      deletedAt: null,
    }).exec();

    return user;
  }

  async save(user: TUserDocument) {
    await user.save();
  }
}
