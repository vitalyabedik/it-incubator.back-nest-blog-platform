import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateAccessTokenInputDto } from './input-dto/create-access-token.input-dto';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessToken(dto: CreateAccessTokenInputDto) {
    const secret = this.configService.getOrThrow<string>('AC_SECRET');
    const expiresIn = this.configService.getOrThrow<number>('AC_TIME');

    const accessToken = await this.jwtService.signAsync(dto, {
      secret,
      expiresIn,
    });

    return accessToken;
  }
}
