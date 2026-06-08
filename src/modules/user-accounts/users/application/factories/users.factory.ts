import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from '../../dto/create-user.dto';
import { CryptoService } from '../../../auth/application/services/crypto.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserViewDto } from '../view-dto/users.view-dto';

@Injectable()
export class UsersFactory {
  constructor(
    private usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async createConfirmedUser(dto: CreateUserDto): Promise<UserViewDto> {
    const { login, email, password } = dto;

    const passwordHash = await this.createPasswordHash(password);

    const createdUser = await this.usersRepository.createConfirmedUser({
      login,
      email,
      passwordHash,
    });

    return UserViewDto.mapToView(createdUser);
  }

  async createUnconfirmedUser(
    dto: CreateUserDto,
  ): Promise<{ user: UserViewDto; confirmationCode: string }> {
    const { login, email, password } = dto;

    const passwordHash = await this.createPasswordHash(password);
    const confirmationCode = randomUUID();
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

    const createdUser = await this.usersRepository.createUnconfirmedUser({
      login,
      email,
      passwordHash,
      confirmationCode,
      expirationDate,
    });

    return {
      user: UserViewDto.mapToView(createdUser),
      confirmationCode,
    };
  }

  private async createPasswordHash(password: string): Promise<string> {
    const passwordHash = await this.cryptoService.createPasswordHash(password);

    return passwordHash;
  }
}
