import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestingModule } from './modules/testing/testing.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getMongooseConfig } from './config/mongoose.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: getMongooseConfig,
      inject: [ConfigService],
    }),
    UserAccountsModule,
    BloggersPlatformModule,
    TestingModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
