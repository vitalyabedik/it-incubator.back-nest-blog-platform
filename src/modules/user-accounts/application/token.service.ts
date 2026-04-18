import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../core/constants/tokens';
import { CreateAccessTokenInputDto } from './input-dto/create-access-token.input-dto';

@Injectable()
export class TokenService {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessJwtService: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshJwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessToken(dto: CreateAccessTokenInputDto) {
    const expiresInRaw = this.configService.getOrThrow<string>('AC_TIME');
    const expiresIn = parseInt(expiresInRaw, 10);

    const accessToken = await this.accessJwtService.signAsync(dto, {
      expiresIn,
    });

    return accessToken;
  }

  async createRefreshToken(dto: CreateAccessTokenInputDto) {
    const expiresInRaw = this.configService.getOrThrow<string>('RT_TIME');
    const expiresIn = parseInt(expiresInRaw, 10);

    const refreshToken = await this.refreshJwtService.signAsync(dto, {
      expiresIn,
    });

    return refreshToken;
  }
}
