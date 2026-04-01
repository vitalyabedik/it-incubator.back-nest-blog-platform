import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, TUserModel } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: TUserModel,
    private usersRepository: UsersRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });

    await this.usersRepository.save(user);

    return user._id.toString();
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepository.findUserById(id);

    user.softDelete();

    await this.usersRepository.save(user);
  }
}
