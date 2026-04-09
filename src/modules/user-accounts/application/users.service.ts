import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { User, TUserModel } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { CryptoService } from './crypto.service';
import { errorMessages } from '../constants/texts';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: TUserModel,
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const userExistenceCheck = await this.UserModel.checkIsUserExist(dto);

    if (userExistenceCheck.isExist) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: errorMessages.uniqueLogin,
      });
    }

    const passwordHash = await this.cryptoService.createPasswordHash(
      dto.password,
    );

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
