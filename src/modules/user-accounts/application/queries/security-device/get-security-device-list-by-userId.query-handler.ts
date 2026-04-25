import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../../constants/texts';
import { SecurityDeviceQueryRepository } from '../../../infrastructure/query/security-device.query-repository';
import { SecurityDeviceViewDto } from '../../view-dto/security-device.view-dto';
import { TokenService } from '../../token.service';

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

    return this.securityDeviceQueryRepository.getSecurityDeviceListByUserId(
      verifiedRefreshToken.userId,
    );
  }
}
