import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { TokenService } from '../../../auth/application/services/token.service';
import { errorMessages as userErrorMessages } from '../../../users/constants/texts';
import { SecurityDeviceRepository } from '../../infrastructure/security-device.repository';

export class DeleteSecurityDeviceListExceptCurrentCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(DeleteSecurityDeviceListExceptCurrentCommand)
export class DeleteSecurityDeviceExceptCurrentUseCase implements ICommandHandler<
  DeleteSecurityDeviceListExceptCurrentCommand,
  boolean
> {
  constructor(
    private securityDeviceRepository: SecurityDeviceRepository,
    private tokenService: TokenService,
  ) {}

  async execute({
    refreshToken,
  }: DeleteSecurityDeviceListExceptCurrentCommand): Promise<boolean> {
    const verifiedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    if (!verifiedRefreshToken) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: userErrorMessages.unauthorized,
      });
    }

    await this.securityDeviceRepository.deleteSessionListExceptTheCurrent({
      userId: verifiedRefreshToken.userId,
      deviceId: verifiedRefreshToken.deviceId,
    });

    return true;
  }
}
