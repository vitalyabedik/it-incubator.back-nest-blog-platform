import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './auth/constants/tokens';

import { NotificationsModule } from '../notifications/notifications.module';

import { UsersController } from './users/api/users.controller';
import { UsersService } from './users/application/services/users.service';
import { TokenService } from './auth/application/services/token.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersQueryRepository } from './users/infrastructure/query/users.query-repository';
import { UsersFactory } from './users/application/factories/users.factory';
import { GetUserByIdQueryHandler } from './users/application/queries/get-user-by-id.query-handler';
import { GetUserListQueryHandler } from './users/application/queries/get-user-list.query-handler';

import { BearerAuthGuard } from './auth/guards/bearer/bearer-auth.guard';
import { OptionalBearerAuthGuard } from './auth/guards/bearer/optional-bearer-auth.guard';
import { CryptoService } from './auth/application/services/crypto.service';
import { CreateUserUseCase } from './users/application/usecases/create-user.usecase';
import { DeleteUserUseCase } from './users/application/usecases/delete-user.usecase';
import { LoginUserUseCase } from './auth/application/usecases/login-user.usecase';
import { NewPasswordUserUseCase } from './auth/application/usecases/new-password-user.usecase';
import { PasswordRecoveryUserUseCase } from './auth/application/usecases/password-recovery-user.usecase';
import { RegisterConfirmationUserUseCase } from './auth/application/usecases/register-confirmation-user.usecase';
import { RegisterEmailResendingUserUseCase } from './auth/application/usecases/register-email-resending-user.usecase';
import { RegisterUserUseCase } from './auth/application/usecases/register-user.usecase';
import { RefreshTokenUseCase } from './auth/application/usecases/refresh-token.usecase';
import { LogoutUserUseCase } from './auth/application/usecases/logout-user.usecase';
import { AuthController } from './auth/api/auth.controller';

import { SecurityDeviceRepository } from './security-device/infrastructure/security-device.repository';
import { SecurityDeviceQueryRepository } from './security-device/infrastructure/query/security-device.query-repository';
import { CreateSecurityDeviceUseCase } from './security-device/application/usecases/create-security-device.usecase';
import { DeleteSecurityDeviceByDeviceIdUseCase } from './security-device/application/usecases/delete-security-device-by-deviceId.usecase';
import { DeleteSecurityDeviceExceptCurrentUseCase } from './security-device/application/usecases/delete-security-device-list-except-current.usecase';
import { GetSecurityDeviceListByUserIdHandler } from './security-device/application/queries/get-security-device-list-by-userId.query-handler';
import { SecurityDeviceController } from './security-device/api/security-device.controller';
import { SecurityDeviceFactory } from './security-device/application/factories/security-device.factory';
import { UserAccountsConfig } from './config/user-accounts.config';
import { jwtConfigProviders } from './config/jwt-config.provider';

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
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 10000, limit: 5 }] }),
    NotificationsModule,
    JwtModule,
  ],
  controllers: [AuthController, UsersController, SecurityDeviceController],
  providers: [
    ...jwtConfigProviders,
    ...commandHandlers,
    ...queryHandlers,
    UsersService,
    UsersRepository,
    SecurityDeviceRepository,
    UsersQueryRepository,
    SecurityDeviceQueryRepository,
    TokenService,
    CryptoService,
    SecurityDeviceFactory,
    OptionalBearerAuthGuard,
    BearerAuthGuard,
    UsersFactory,
    UserAccountsConfig,
  ],
  exports: [
    BearerAuthGuard,
    OptionalBearerAuthGuard,
    UserAccountsConfig,
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
  ],
})
export class UserAccountsModule {}
