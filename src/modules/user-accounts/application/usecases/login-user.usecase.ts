import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { UserLoginInputDto } from '../input-dto/user-login.input-dto';
import { TokenService } from '../token.service';
import { AuthService } from '../auth.service';

export type TLoginUserCommandOutput = {
  accessToken: string | null;
  refreshToken: string | null;
};

export class LoginUserCommand {
  constructor(public dto: UserLoginInputDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<
  LoginUserCommand,
  TLoginUserCommandOutput
> {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  async execute({ dto }: LoginUserCommand): Promise<TLoginUserCommandOutput> {
    const user = await this.authService.validateUserCredentials(dto);

    if (!user) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    return { accessToken, refreshToken };
  }
}
