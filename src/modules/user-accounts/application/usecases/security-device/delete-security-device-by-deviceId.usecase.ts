import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityDeviceRepository } from '../../../infrastructure/security-device.repository';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { errorMessages } from '../../../constants/texts';
import { ESecurityDeviceField } from '../../../constants/errors';
import { TokenService } from '../../token.service';

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
        message: errorMessages.unauthorized,
      });
    }

    const securityDevice =
      await this.securityDeviceRepository.findSecurityDeviceByIdOrThrow(
        deviceId,
      );

    if (securityDevice.checkIsForeignSession(verifiedRefreshToken.userId)) {
      throw new DomainException({
        code: EDomainExceptionCode.Forbidden,
        message: errorMessages.noCurrentOwner,
        extensions: [
          {
            field: ESecurityDeviceField.DEVICE_ID,
            message: errorMessages.noCurrentOwner,
          },
        ],
      });
    }

    await this.securityDeviceRepository.deleteSecurityDeviceByDeviceIdAndUserId(
      verifiedRefreshToken.userId,
      deviceId,
    );

    return true;
  }
}
