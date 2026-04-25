import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersExternalService {
  constructor(
    @InjectModel(User.name)
    private usersRepository: UsersRepository,
  ) {}

  async makeUserAsSpammer(userId: string) {
    const user = await this.usersRepository.findUserByIdOrThrow(userId);

    await this.usersRepository.save(user);
  }
}
