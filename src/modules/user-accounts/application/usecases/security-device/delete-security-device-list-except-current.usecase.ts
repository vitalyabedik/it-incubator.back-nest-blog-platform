import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../../constants/texts';
import { SecurityDeviceRepository } from '../../../infrastructure/security-device.repository';
import { TokenService } from '../../token.service';

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
        message: errorMessages.unauthorized,
      });
    }

    const { userId, deviceId } = verifiedRefreshToken;

    await this.securityDeviceRepository.deleteSecurityDeviceListExceptTheCurrent(
      userId,
      deviceId,
    );

    return true;
  }
}
