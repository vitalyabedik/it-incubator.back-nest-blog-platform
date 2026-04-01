import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User, TUserModel } from '../../domain/user.entity';
import { errorMessages } from '../../constants/texts';
import { UserExternalDto } from './external-dto/users.external-dto';

@Injectable()
export class UsersExternalQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: TUserModel,
  ) {}

  async getUserById(id: string): Promise<UserExternalDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!user) {
      throw new NotFoundException(errorMessages.notFound);
    }

    return UserExternalDto.mapToView(user);
  }
}
