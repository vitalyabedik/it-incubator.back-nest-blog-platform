import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { FindUserByIdQuery } from '../queries/find-user-by-id.query-handler';
import { TUserDocument } from '../../domain/user.entity';

export class DeleteUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<
  DeleteUserCommand,
  void
> {
  constructor(
    private usersRepository: UsersRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ userId }: DeleteUserCommand): Promise<void> {
    const user = await this.queryBus.execute<FindUserByIdQuery, TUserDocument>(
      new FindUserByIdQuery(userId),
    );

    user.softDelete();

    await this.usersRepository.save(user);
  }
}
