import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/tokens';

import { NotificationsModule } from '../notifications/notifications.module';
import { User, UserSchema } from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { TokenService } from './application/token.service';
import { UsersExternalService } from './application/users.external-service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersExternalQueryRepository } from './infrastructure/external-query/users.external-query-repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { BearerAuthGuard } from './guards/bearer/bearer-auth.guard';
import { OptionalBearerAuthGuard } from './guards/bearer/optional-bearer-auth.guard';
import { CryptoService } from './application/crypto.service';
import { GetUserByIdQueryHandler } from './application/queries/user/get-user-by-id.query-handler';
import { GetUserListQueryHandler } from './application/queries/user/get-user-list.query-handler';
import { CreateUserUseCase } from './application/usecases/user/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/user/delete-user.usecase';
import { LoginUserUseCase } from './application/usecases/user/login-user.usecase';
import { NewPasswordUserUseCase } from './application/usecases/user/new-password-user.usecase';
import { PasswordRecoveryUserUseCase } from './application/usecases/user/password-recovery-user.usecase';
import { RegisterConfirmationUserUseCase } from './application/usecases/user/register-confirmation-user.usecase';
import { RegisterEmailResendingUserUseCase } from './application/usecases/user/register-email-resending-user.usecase';
import { RegisterUserUseCase } from './application/usecases/user/register-user.usecase';
import { UsersFactory } from './application/factories/users.factory';
import { UserAccountsConfig } from './config/user-accounts.config';
import { SecurityDeviceRepository } from './infrastructure/security-device.repository';
import { SecurityDeviceQueryRepository } from './infrastructure/query/security-device.query-repository';
import { LogoutUserUseCase } from './application/usecases/user/logout-user.usecase';
import { CreateSecurityDeviceUseCase } from './application/usecases/security-device/create-security-device.usecase';
import { DeleteSecurityDeviceByDeviceIdUseCase } from './application/usecases/security-device/delete-security-device-by-deviceId.usecase';
import { DeleteSecurityDeviceExceptCurrentUseCase } from './application/usecases/security-device/delete-security-device-list-except-current.usecase';
import { RefreshTokenUseCase } from './application/usecases/user/refresh-token.usecase';
import { GetSecurityDeviceListByUserIdHandler } from './application/queries/security-device/get-security-device-list-by-userId.query-handler';
import {
  SecurityDevice,
  SecurityDeviceSchema,
} from './domain/security-device.entity';
import { SecurityDeviceFactory } from './application/factories/security-device.factory';
import { SecurityDeviceController } from './api/security-device.controller';

const commandHandlers = [
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  NewPasswordUserUseCase,
  PasswordRecoveryUserUseCase,
  RegisterConfirmationUserUseCase,
  RegisterEmailResendingUserUseCase,
  RegisterUserUseCase,
  RefreshTokenUseCase,
  CreateSecurityDeviceUseCase,
  DeleteSecurityDeviceByDeviceIdUseCase,
  DeleteSecurityDeviceExceptCurrentUseCase,
];
const queryHandlers = [
  GetUserByIdQueryHandler,
  GetUserListQueryHandler,
  GetSecurityDeviceListByUserIdHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: SecurityDevice.name, schema: SecurityDeviceSchema },
    ]),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 10000, limit: 5 }] }),
    NotificationsModule,
    JwtModule,
  ],
  controllers: [AuthController, UsersController, SecurityDeviceController],
  providers: [
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.accessTokenSecret,
          signOptions: { expiresIn: userAccountConfig.accessTokenExpireIn },
        });
      },
      inject: [UserAccountsConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.refreshTokenSecret,
          signOptions: { expiresIn: userAccountConfig.refreshTokenExpireIn },
        });
      },
      inject: [UserAccountsConfig],
    },
    AuthService,
    UsersExternalService,
    UsersRepository,
    SecurityDeviceRepository,
    UsersQueryRepository,
    SecurityDeviceQueryRepository,
    UsersExternalQueryRepository,
    TokenService,
    CryptoService,
    SecurityDeviceFactory,
    OptionalBearerAuthGuard,
    BearerAuthGuard,
    UsersFactory,
    UserAccountsConfig,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [
    UsersExternalService,
    UsersExternalQueryRepository,
    BearerAuthGuard,
    OptionalBearerAuthGuard,
    UserAccountsConfig,
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
  ],
})
export class UserAccountsModule {}
