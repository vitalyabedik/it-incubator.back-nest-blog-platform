import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/users.repository';
import { TUserDocument } from '../../domain/user.entity';

export class FindUserByPasswordRecoveryCodeQuery {
  constructor(public code: string) {}
}

@QueryHandler(FindUserByPasswordRecoveryCodeQuery)
export class FindUserByPasswordRecoveryCodeQueryHandler implements IQueryHandler<
  FindUserByPasswordRecoveryCodeQuery,
  TUserDocument | null
> {
  constructor(
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    code,
  }: FindUserByPasswordRecoveryCodeQuery): Promise<TUserDocument | null> {
    return this.usersRepository.findUserByPasswordRecoveryCode(code);
  }
}
