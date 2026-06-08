import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { TokenService } from '../../../auth/application/services/token.service';
import { errorMessages } from '../../../users/constants/texts';
import { SecurityDeviceQueryRepository } from '../../infrastructure/query/security-device.query-repository';
import { SecurityDeviceViewDto } from '../view-dto/security-device.view-dto';

export class GetSecurityDeviceListByUserIdQuery {
  constructor(public refreshToken: string) {}
}

@QueryHandler(GetSecurityDeviceListByUserIdQuery)
export class GetSecurityDeviceListByUserIdHandler implements IQueryHandler<
  GetSecurityDeviceListByUserIdQuery,
  SecurityDeviceViewDto[]
> {
  constructor(
    private securityDeviceQueryRepository: SecurityDeviceQueryRepository,
    private tokenService: TokenService,
  ) {}

  async execute({
    refreshToken,
  }: GetSecurityDeviceListByUserIdQuery): Promise<SecurityDeviceViewDto[]> {
    const verifiedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    if (!verifiedRefreshToken) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    const securityDevices =
      await this.securityDeviceQueryRepository.getSecurityDeviceListByUserId(
        verifiedRefreshToken.userId,
      );

    return securityDevices.map(SecurityDeviceViewDto.mapToView);
  }
}
