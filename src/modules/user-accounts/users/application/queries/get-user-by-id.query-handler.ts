import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infrastructure/query/users.query-repository';
// import { UserViewDto } from '../view-dto/users.view-dto';

// TODO: Реализовать полноценный GetUserByIdQueryHandler, который будет возвращать UserViewDto по id
export class GetUserByIdQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<
  GetUserByIdQuery,
  // UserViewDto
  string
> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute({ userId }: GetUserByIdQuery) {
    return userId;
    // return this.usersQueryRepository.getUserById(userId);
  }

  //  async execute({ userId }: GetUserByIdQuery): Promise<UserViewDto> {
  //   return this.usersQueryRepository.getUserById(userId);
  // }
}
