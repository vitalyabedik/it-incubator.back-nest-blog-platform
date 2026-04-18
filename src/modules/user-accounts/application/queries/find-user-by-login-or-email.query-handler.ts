import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
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
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    loginOrEmail,
  }: FindUserByLoginOrEmailQuery): Promise<TUserDocument | null> {
    return this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
  }
}
