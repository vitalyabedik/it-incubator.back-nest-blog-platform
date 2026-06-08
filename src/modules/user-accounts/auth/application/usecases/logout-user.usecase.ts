import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../../users/constants/texts';
import { SecurityDeviceRepository } from '../../../security-device/infrastructure/security-device.repository';
import { TokenService } from '../services/token.service';

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

    const isDeleting = await this.securityDeviceRepository.deleteSession({
      userId,
      deviceId,
      iat,
    });

    if (!isDeleting) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }
  }
}
