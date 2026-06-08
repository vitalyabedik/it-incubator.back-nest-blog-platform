import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../constants/tokens';
import { CreateAccessTokenInputDto } from '../input-dto/create-access-token.input-dto';
import { CreateRefreshTokenInputDto } from '../input-dto/create-refresh-token.input-dto';
import { UserAccountsConfig } from '../../../config/user-accounts.config';

export type TVerifyRefreshTokenArgs = {
  userId: string;
  login: string;
  deviceId: string;
  iat: number;
  exp: number;
};

@Injectable()
export class TokenService {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessJwtService: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshJwtService: JwtService,
    private readonly userAccountsConfig: UserAccountsConfig,
  ) {}

  async createAccessToken(dto: CreateAccessTokenInputDto) {
    const accessToken = await this.accessJwtService.signAsync(dto);

    return accessToken;
  }

  private async createRefreshToken(dto: CreateRefreshTokenInputDto) {
    const refreshToken = await this.refreshJwtService.signAsync(dto);

    return refreshToken;
  }

  async createRefreshTokenWithInfo(dto: CreateRefreshTokenInputDto) {
    const refreshToken = await this.createRefreshToken(dto);
    const decodedRefreshToken =
      this.refreshJwtService.decode<TVerifyRefreshTokenArgs | null>(
        refreshToken,
      );

    if (
      !decodedRefreshToken?.iat ||
      !decodedRefreshToken?.exp ||
      !decodedRefreshToken?.deviceId
    )
      return null;

    return {
      refreshToken,
      deviceId: decodedRefreshToken.deviceId,
      iat: decodedRefreshToken.iat,
      expirationAt: decodedRefreshToken.exp,
    };
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const verifiedRefreshToken =
        await this.refreshJwtService.verifyAsync<TVerifyRefreshTokenArgs>(
          refreshToken,
        );

      return verifiedRefreshToken;
    } catch {
      return null;
    }
  }
}
