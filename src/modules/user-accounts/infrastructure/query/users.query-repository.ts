import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { TUserModel, User } from '../../domain/user.entity';
import { UserViewDto } from '../../application/view-dto/users.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { errorMessages } from '../../constants/texts';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: TUserModel,
  ) {}

  async getUserList(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const filter = query.getFilter();

    const [items, totalCount] = await Promise.all([
      this.UserModel.find(filter)
        .sort(query.getSortOptions())
        .skip(query.calculateSkip())
        .limit(query.pageSize)
        .lean()
        .exec(),
      this.UserModel.countDocuments(filter).exec(),
    ]);

    const usersViewList = items.map(UserViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: usersViewList,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getUserById(id: string): Promise<UserViewDto> {
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

    return UserViewDto.mapToView(user);
  }
}
