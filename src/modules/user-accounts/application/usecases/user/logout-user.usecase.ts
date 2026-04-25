import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../../constants/texts';
import { SecurityDeviceRepository } from '../../../infrastructure/security-device.repository';
import { TokenService } from '../../token.service';

export class LogoutUserCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<
  LogoutUserCommand,
  void
> {
  constructor(
    private securityDeviceRepository: SecurityDeviceRepository,
    private tokenService: TokenService,
  ) {}

  async execute({ refreshToken }: LogoutUserCommand): Promise<void> {
    const verifiedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    if (!verifiedRefreshToken) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    const { userId, deviceId, iat } = verifiedRefreshToken;

    const securityDevice =
      await this.securityDeviceRepository.findSecurityDeviceByFilter({
        userId,
        deviceId,
        iat,
      });

    if (!securityDevice) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    await this.securityDeviceRepository.deleteSecurityDeviceByDeviceIdAndUserId(
      userId,
      deviceId,
    );
  }
}
