import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityDeviceRepository } from '../../infrastructure/security-device.repository';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { TokenService } from '../../../auth/application/services/token.service';
import { errorMessages as userErrorMessages } from '../../../users/constants/texts';
import { errorMessages as securityDeviceErrorMessages } from '../../constants/texts';
import { ESecurityDeviceField } from '../../constants/errors';

export class DeleteSecurityDeviceByDeviceIdCommand {
  constructor(
    public deviceId: string,
    public refreshToken: string,
  ) {}
}

@CommandHandler(DeleteSecurityDeviceByDeviceIdCommand)
export class DeleteSecurityDeviceByDeviceIdUseCase implements ICommandHandler<
  DeleteSecurityDeviceByDeviceIdCommand,
  boolean
> {
  constructor(
    private securityDeviceRepository: SecurityDeviceRepository,
    private tokenService: TokenService,
  ) {}

  async execute({
    deviceId,
    refreshToken,
  }: DeleteSecurityDeviceByDeviceIdCommand): Promise<boolean> {
    const verifiedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    if (!verifiedRefreshToken) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: userErrorMessages.unauthorized,
      });
    }

    const session =
      await this.securityDeviceRepository.findSessionByIdOrThrow(deviceId);

    if (session.userId !== verifiedRefreshToken.userId) {
      throw new DomainException({
        code: EDomainExceptionCode.Forbidden,
        message: securityDeviceErrorMessages.noCurrentOwner,
        extensions: [
          {
            field: ESecurityDeviceField.DEVICE_ID,
            message: securityDeviceErrorMessages.noCurrentOwner,
          },
        ],
      });
    }

    await this.securityDeviceRepository.deleteSession({
      deviceId: session.deviceId,
      userId: session.userId,
      iat: session.iat,
    });

    return true;
  }
}
