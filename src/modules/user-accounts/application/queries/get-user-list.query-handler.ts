import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UsersQueryRepository } from '../../infrastructure/query/users.query-repository';
import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { UserViewDto } from '../view-dto/users.view-dto';

export class GetUserListQuery {
  constructor(public queryParams: GetUsersQueryParams) {}
}

@QueryHandler(GetUserListQuery)
export class GetUserListQueryHandler implements IQueryHandler<
  GetUserListQuery,
  PaginatedViewDto<UserViewDto[]>
> {
  constructor(
    @Inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(
    query: GetUserListQuery,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getUserList(query.queryParams);
  }
}
