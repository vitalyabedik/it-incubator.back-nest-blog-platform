import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersFactory } from '../factories/users.factory';
import { UserViewDto } from '../view-dto/users.view-dto';
import { UsersService } from '../services/users.service';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<
  CreateUserCommand,
  UserViewDto
> {
  constructor(
    private usersFactory: UsersFactory,
    private userService: UsersService,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<UserViewDto> {
    await this.userService.checkIsUserEmailExists(dto.email);

    return this.usersFactory.createConfirmedUser(dto);
  }
}
