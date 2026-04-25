import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { CryptoService } from './crypto.service';
import { UserLoginInputDto } from './input-dto/user/user-login.input-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async validateUserCredentials(dto: UserLoginInputDto) {
    const { loginOrEmail, password } = dto;

    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const isValidPassword = await this.cryptoService.comparePasswords({
      password,
      hash: user.passwordHash,
    });
    if (!isValidPassword) return null;

    return {
      userId: user.id.toString(),
      login: user.login,
      email: user.email,
    };
  }
}
