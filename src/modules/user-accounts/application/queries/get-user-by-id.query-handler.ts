import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UsersQueryRepository } from '../../infrastructure/query/users.query-repository';
import { UserViewDto } from '../view-dto/users.view-dto';

export class GetUserByIdQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<
  GetUserByIdQuery,
  UserViewDto
> {
  constructor(
    @Inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute({ userId }: GetUserByIdQuery): Promise<UserViewDto> {
    return this.usersQueryRepository.getUserById(userId);
  }
}
