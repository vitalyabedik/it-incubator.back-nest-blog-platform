import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { RefreshTokenInputDto } from '../../../auth/application/input-dto/refresh-token.input-dto';
import { SecurityDeviceRepository } from '../../../security-device/infrastructure/security-device.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { errorMessages } from '../../../users/constants/texts';
import { TokenService } from '../services/token.service';
import { TLoginUserCommandOutput } from './login-user.usecase';

export class RefreshTokenCommand {
  constructor(public dto: RefreshTokenInputDto) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<
  RefreshTokenCommand,
  TLoginUserCommandOutput
> {
  constructor(
    private usersRepository: UsersRepository,
    private securityDeviceRepository: SecurityDeviceRepository,
    private tokenService: TokenService,
  ) {}

  async execute({
    dto,
  }: RefreshTokenCommand): Promise<TLoginUserCommandOutput> {
    const verifiedRefreshToken = await this.tokenService.verifyRefreshToken(
      dto.refreshToken,
    );

    if (!verifiedRefreshToken) {
      this.throwUnauthorizedError();
    }

    const { userId, deviceId, iat } = verifiedRefreshToken;

    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      this.throwUnauthorizedError();
    }

    const { login, email } = user;

    const newAccessToken = await this.tokenService.createAccessToken({
      userId,
      login,
      email,
    });
    const newRefreshTokenWithInfo =
      await this.tokenService.createRefreshTokenWithInfo({
        userId,
        login,
        deviceId,
      });

    if (!newRefreshTokenWithInfo) {
      this.throwUnauthorizedError();
    }

    const isUpdated = await this.securityDeviceRepository.updateSession({
      userId,
      deviceId,
      iat,
      newIat: newRefreshTokenWithInfo.iat,
      newExpirationAt: newRefreshTokenWithInfo.expirationAt,
    });

    if (!isUpdated) {
      this.throwUnauthorizedError();
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshTokenWithInfo.refreshToken,
    };
  }

  private throwUnauthorizedError(): never {
    throw new DomainException({
      code: EDomainExceptionCode.Unauthorized,
      message: errorMessages.invalidUserNameOrPassword,
    });
  }
}
