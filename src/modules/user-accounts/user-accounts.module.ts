import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from 'src/core/constants/tokens';

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
    ConfigModule,
    NotificationsModule,
    JwtModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    UsersExternalService,
    UsersRepository,
    UsersQueryRepository,
    UsersExternalQueryRepository,
    TokenService,
    CryptoService,
    BearerAuthGuard,
    UsersFactory,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (configService: ConfigService): JwtService => {
        const secret = configService.getOrThrow<string>('AC_SECRET');

        const expiresIn = configService.getOrThrow<number>('AC_TIME');
        console.log('expiresIn', expiresIn);

        return new JwtService({
          secret,
          signOptions: { expiresIn },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (configService: ConfigService): JwtService => {
        const secret = configService.getOrThrow<string>('RT_SECRET');

        const expiresIn = configService.getOrThrow<number>('RT_TIME');

        return new JwtService({
          secret,
          signOptions: { expiresIn },
        });
      },
      inject: [ConfigService],
    },
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [
    UsersExternalService,
    UsersExternalQueryRepository,
    BearerAuthGuard,
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
  ],
})
export class UserAccountsModule {}
