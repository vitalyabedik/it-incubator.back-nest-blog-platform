import { ClientInfoDto } from '../../../../../core/decorators/client-info/extract-client-info';

export class RefreshTokenInputDto {
  clientInfo: ClientInfoDto;
  refreshToken: string;
}
