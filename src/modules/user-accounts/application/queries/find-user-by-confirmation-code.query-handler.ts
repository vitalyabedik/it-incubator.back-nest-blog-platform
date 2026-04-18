import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { TUserDocument } from '../../domain/user.entity';

export class FindUserByConfirmationCodeQuery {
  constructor(public confirmationCode: string) {}
}

@QueryHandler(FindUserByConfirmationCodeQuery)
export class FindUserByConfirmationCodeQueryHandler implements IQueryHandler<
  FindUserByConfirmationCodeQuery,
  TUserDocument | null
> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    confirmationCode,
  }: FindUserByConfirmationCodeQuery): Promise<TUserDocument | null> {
    return this.usersRepository.findUserByConfirmationCode(confirmationCode);
  }
}
