import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException(errorMessages.notFound);
    }

    return user;
  }

  async save(user: TUserDocument) {
    await user.save();
  }
}
