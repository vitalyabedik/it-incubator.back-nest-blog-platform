import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/users.repository';
import { TUserDocument } from '../../domain/user.entity';

export class FindUserByIdQuery {
  constructor(public userId: string) {}
}

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler implements IQueryHandler<
  FindUserByIdQuery,
  TUserDocument
> {
  constructor(
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async execute({ userId }: FindUserByIdQuery): Promise<TUserDocument> {
    return this.usersRepository.findUserById(userId);
  }
}
