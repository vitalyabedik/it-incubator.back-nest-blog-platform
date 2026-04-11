import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { NotificationsModule } from '../notifications/notifications.module';
import { User, UserSchema } from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { AuthController } from './api/auth.controller';
import { UsersService } from './application/users.service';
import { AuthService } from './application/auth.service';
import { TokenService } from './application/token.service';
import { UsersExternalService } from './application/users.external-service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersExternalQueryRepository } from './infrastructure/external-query/users.external-query-repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { BearerAuthGuard } from './guards/bearer/bearer-auth.guard';
import { CryptoService } from './application/crypto.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 10000, limit: 5 }] }),
    NotificationsModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    UsersService,
    AuthService,
    UsersExternalService,
    UsersRepository,
    UsersQueryRepository,
    UsersExternalQueryRepository,
    TokenService,
    CryptoService,
    BearerAuthGuard,
  ],
  exports: [UsersExternalService, UsersExternalQueryRepository],
})
export class UserAccountsModule {}
