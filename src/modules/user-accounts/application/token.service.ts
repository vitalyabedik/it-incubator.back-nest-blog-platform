import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../core/constants/tokens';
import { CreateAccessTokenInputDto } from './input-dto/create-access-token.input-dto';
import { UserAccountsConfig } from '../config/user-accounts.config';

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
    // const expiresInRaw = this.userAccountsConfig.accessTokenExpireIn;
    // const expiresIn = parseInt(expiresInRaw, 10);

    const expiresIn = this.userAccountsConfig.accessTokenExpireIn;

    const accessToken = await this.accessJwtService.signAsync(dto, {
      expiresIn,
    });

    return accessToken;
  }

  async createRefreshToken(dto: CreateAccessTokenInputDto) {
    // const expiresInRaw = this.userAccountsConfig.refreshTokenExpireIn;
    // const expiresIn = parseInt(expiresInRaw, 10);

    const expiresIn = this.userAccountsConfig.refreshTokenExpireIn;

    const refreshToken = await this.refreshJwtService.signAsync(dto, {
      expiresIn,
    });

    return refreshToken;
  }
}
