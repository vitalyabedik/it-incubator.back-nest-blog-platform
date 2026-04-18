import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { TUserDocument } from '../../domain/user.entity';

export class FindUserByLoginOrEmailOrThrowQuery {
  constructor(public loginOrEmail: string) {}
}

@QueryHandler(FindUserByLoginOrEmailOrThrowQuery)
export class FindUserByLoginOrEmailOrThrowQueryHandler implements IQueryHandler<
  FindUserByLoginOrEmailOrThrowQuery,
  TUserDocument
> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    loginOrEmail,
  }: FindUserByLoginOrEmailOrThrowQuery): Promise<TUserDocument> {
    return this.usersRepository.findByLoginOrEmailOrThrow(loginOrEmail);
  }
}
