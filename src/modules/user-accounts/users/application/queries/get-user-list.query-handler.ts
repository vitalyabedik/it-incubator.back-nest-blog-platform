import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { UsersQueryRepository } from '../../infrastructure/query/users.query-repository';
import { IGetUsersParamsDto } from '../../infrastructure/query/dto/get-users.params.dto';
import { IGetUserListQueryDto } from '../dto/get-user-list.query.dto';
import { UserViewDto } from '../view-dto/users.view-dto';

export class GetUserListQuery {
  constructor(public queryParams: IGetUserListQueryDto) {}
}

@QueryHandler(GetUserListQuery)
export class GetUserListQueryHandler implements IQueryHandler<
  GetUserListQuery,
  PaginatedViewDto<UserViewDto[]>
> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute({
    queryParams,
  }: GetUserListQuery): Promise<PaginatedViewDto<UserViewDto[]>> {
    const params: IGetUsersParamsDto = {
      searchLoginTerm: queryParams.searchLoginTerm,
      searchEmailTerm: queryParams.searchEmailTerm,
      sortBy: queryParams.sortBy,
      sortDirection: queryParams.sortDirection,
      limit: queryParams.pageSize,
      offset: queryParams.calculateSkip(),
    };

    const { users, totalCount } =
      await this.usersQueryRepository.getUserList(params);

    const usersViewList = users.map(UserViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: usersViewList,
      totalCount,
      page: queryParams.pageNumber,
      size: queryParams.pageSize,
    });
  }
}
