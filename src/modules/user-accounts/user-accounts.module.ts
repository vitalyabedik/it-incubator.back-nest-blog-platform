import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../core/constants/tokens';

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
import { FindUserByConfirmationCodeQueryHandler } from './application/queries/find-user-by-confirmation-code.query-handler';
import { FindUserByIdQueryHandler } from './application/queries/find-user-by-id.query-handler';
import { FindUserByLoginOrEmailOrThrowQueryHandler } from './application/queries/find-user-by-login-or-email-or-throw.query-handler';
import { FindUserByLoginOrEmailQueryHandler } from './application/queries/find-user-by-login-or-email.query-handler';
import { FindUserByPasswordRecoveryCodeQueryHandler } from './application/queries/find-user-by-password-recovery-code.query-handler';
import { GetUserByIdQueryHandler } from './application/queries/get-user-by-id.query-handler';
import { GetUserListQueryHandler } from './application/queries/get-user-list.query-handler';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { NewPasswordUserUseCase } from './application/usecases/new-password-user.usecase';
import { PasswordRecoveryUserUseCase } from './application/usecases/password-recovery-user.usecase';
import { RegisterConfirmationUserUseCase } from './application/usecases/register-confirmation-user.usecase';
import { RegisterEmailResendingUserUseCase } from './application/usecases/register-email-resending-user.usecase';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { UsersFactory } from './application/factories/users.factory';
import { UserAccountsConfig } from './config/user-accounts.config';

const commandHandlers = [
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  NewPasswordUserUseCase,
  PasswordRecoveryUserUseCase,
  RegisterConfirmationUserUseCase,
  RegisterEmailResendingUserUseCase,
  RegisterUserUseCase,
];
const queryHandlers = [
  FindUserByConfirmationCodeQueryHandler,
  FindUserByIdQueryHandler,
  FindUserByLoginOrEmailOrThrowQueryHandler,
  FindUserByLoginOrEmailQueryHandler,
  FindUserByPasswordRecoveryCodeQueryHandler,
  GetUserByIdQueryHandler,
  GetUserListQueryHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 10000, limit: 5 }] }),
    NotificationsModule,
    JwtModule,
  ],
  controllers: [AuthController, UsersController],
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
    UsersQueryRepository,
    UsersExternalQueryRepository,
    TokenService,
    CryptoService,
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
