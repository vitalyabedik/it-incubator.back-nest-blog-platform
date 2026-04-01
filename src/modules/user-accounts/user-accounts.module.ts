import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { User, UserSchema } from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersExternalService } from './application/users.external-service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersExternalQueryRepository } from './infrastructure/external-query/users.external-query-repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersExternalService,
    UsersRepository,
    UsersQueryRepository,
    UsersExternalQueryRepository,
  ],
  exports: [UsersExternalService, UsersExternalQueryRepository],
})
export class UserAccountsModule {}
