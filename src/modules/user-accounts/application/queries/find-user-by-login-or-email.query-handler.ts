import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/users.repository';
import { TUserDocument } from '../../domain/user.entity';

export class FindUserByLoginOrEmailQuery {
  constructor(public loginOrEmail: string) {}
}

@QueryHandler(FindUserByLoginOrEmailQuery)
export class FindUserByLoginOrEmailQueryHandler implements IQueryHandler<
  FindUserByLoginOrEmailQuery,
  TUserDocument | null
> {
  constructor(
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    loginOrEmail,
  }: FindUserByLoginOrEmailQuery): Promise<TUserDocument | null> {
    return this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
  }
}
