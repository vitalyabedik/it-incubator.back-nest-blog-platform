import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../../constants/texts';
import { RefreshTokenInputDto } from '../../input-dto/user/refresh-token.input-dto';
import { TokenService } from '../../token.service';
import { SecurityDeviceRepository } from '../../../infrastructure/security-device.repository';
import { UsersRepository } from '../../../infrastructure/users.repository';
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

    const securityDevice =
      await this.securityDeviceRepository.findSecurityDeviceByFilter({
        userId,
        deviceId,
        iat,
      });

    if (!securityDevice) {
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

    const updatedSecurityDevice = securityDevice.updateInstance({
      ip: dto.clientInfo.ip,
      iat: newRefreshTokenWithInfo.iat,
      expirationAt: newRefreshTokenWithInfo.expirationAt,
    });

    await this.securityDeviceRepository.save(updatedSecurityDevice);

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
