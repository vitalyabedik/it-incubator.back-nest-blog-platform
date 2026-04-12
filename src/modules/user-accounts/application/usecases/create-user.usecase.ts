import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../domain/user.entity';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersFactory } from '../factories/users.factory';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<
  CreateUserCommand,
  string
> {
  constructor(
    @InjectModel(User.name)
    private usersRepository: UsersRepository,
    private usersFactory: UsersFactory,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<string> {
    const user = await this.usersFactory.createConfirmedUser(dto);

    await this.usersRepository.save(user);

    return user._id.toString();
  }
}
