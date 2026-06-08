import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../auth/constants/tokens';
import { UserAccountsConfig } from './user-accounts.config';

export const jwtConfigProviders = [
  {
    provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    useFactory: (configService: UserAccountsConfig): JwtService => {
      const secret = configService.accessTokenSecret;
      const expiresIn =
        configService.accessTokenExpireIn as JwtSignOptions['expiresIn'];

      return new JwtService({
        secret,
        signOptions: { expiresIn },
      });
    },
    inject: [UserAccountsConfig],
  },
  {
    provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
    useFactory: (configService: UserAccountsConfig): JwtService => {
      const secret = configService.refreshTokenSecret;
      const expiresIn =
        configService.refreshTokenExpireIn as JwtSignOptions['expiresIn'];

      return new JwtService({
        secret,
        signOptions: { expiresIn },
      });
    },
    inject: [UserAccountsConfig],
  },
];
