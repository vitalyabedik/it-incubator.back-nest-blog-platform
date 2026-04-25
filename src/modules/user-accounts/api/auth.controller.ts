import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth } from '@nestjs/swagger';
import { type Response } from 'express';

import { routersPaths } from '../../../core/constants/paths';
import { AppThrottle } from '../../../core/decorators/throttle/app-throttle';
import {
  ExtractClientInfo,
  ClientInfoDto,
} from '../../../core/decorators/client-info/extract-client-info';
import { ExtractCookies } from '../../../core/decorators/cookies/extract-cookies';

import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { UseBearerGuard } from '../guards/decorators/use-bearer-guard.decorator';
import {
  LoginUserCommand,
  TLoginUserCommandOutput,
} from '../application/usecases/user/login-user.usecase';
import { PasswordRecoveryUserCommand } from '../application/usecases/user/password-recovery-user.usecase';
import { NewPasswordUserCommand } from '../application/usecases/user/new-password-user.usecase';
import { RegisterUserCommand } from '../application/usecases/user/register-user.usecase';
import { RegisterConfirmationUserCommand } from '../application/usecases/user/register-confirmation-user.usecase';
import { RegisterEmailResendingUserCommand } from '../application/usecases/user/register-email-resending-user.usecase';
import { AuthLoginInputDto } from './input-dto/user/auth.login-input-dto';
import { AuthPasswordRecoveryInputDto } from './input-dto/user/auth.password-recovery-input-dto';
import { AuthNewPasswordInputDto } from './input-dto/user/auth.new-password-input-dto';
import { AuthRegistrationInputDto } from './input-dto/user/auth.registration-input-dto';
import { AuthRegistrationEmailResendingInputDto } from './input-dto/user/auth.registration-email-resending-input-dto';
import { AuthRegistrationConfirmationInputDto } from './input-dto/user/auth.registration-confirmation-input-dto';
import { UserFromRequestDataInputDto } from './input-dto/user/user-from-request-data-input.dto';
import { LogoutUserCommand } from '../application/usecases/user/logout-user.usecase';
import { RefreshTokenCommand } from '../application/usecases/user/refresh-token.usecase';

@AppThrottle({ limit: 5, ttl: 10_000 })
@Controller(routersPaths.auth.root)
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {
    console.log('AuthController created');
  }

  @Post(routersPaths.auth.login)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: AuthLoginInputDto,
    @Res() response: Response,
    @ExtractClientInfo() clientInfo: ClientInfoDto,
  ) {
    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginUserCommand,
      TLoginUserCommandOutput
    >(new LoginUserCommand(clientInfo, dto));

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    response.send({ accessToken });
  }

  @Post(routersPaths.auth.logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @ExtractCookies('refreshToken') refreshToken: string,
    @Res() response: Response,
  ) {
    await this.commandBus.execute<LogoutUserCommand, void>(
      new LogoutUserCommand(refreshToken),
    );

    response.clearCookie('refreshToken');
    response.status(HttpStatus.NO_CONTENT).send();
  }

  @Post(routersPaths.auth.refreshToken)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @ExtractCookies('refreshToken') refreshToken: string,
    @ExtractClientInfo() clientInfo: ClientInfoDto,
    @Res() response: Response,
  ) {
    const result = await this.commandBus.execute<
      RefreshTokenCommand,
      TLoginUserCommandOutput
    >(new RefreshTokenCommand({ clientInfo, refreshToken }));

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    response.send({ accessToken: result.accessToken });
  }

  @Post(routersPaths.auth.passwordRecovery)
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() dto: AuthPasswordRecoveryInputDto) {
    return this.commandBus.execute<PasswordRecoveryUserCommand, boolean>(
      new PasswordRecoveryUserCommand(dto),
    );
  }

  @Post(routersPaths.auth.newPassword)
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() dto: AuthNewPasswordInputDto) {
    return this.commandBus.execute<NewPasswordUserCommand, boolean>(
      new NewPasswordUserCommand(dto),
    );
  }

  @Post(routersPaths.auth.registration)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: AuthRegistrationInputDto) {
    return this.commandBus.execute<RegisterUserCommand, boolean>(
      new RegisterUserCommand(dto),
    );
  }

  @Post(routersPaths.auth.registrationConfirmation)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() dto: AuthRegistrationConfirmationInputDto,
  ) {
    return this.commandBus.execute<RegisterConfirmationUserCommand, boolean>(
      new RegisterConfirmationUserCommand(dto),
    );
  }

  @Post(routersPaths.auth.registrationEmailResending)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() dto: AuthRegistrationEmailResendingInputDto,
  ) {
    return this.commandBus.execute<RegisterEmailResendingUserCommand, boolean>(
      new RegisterEmailResendingUserCommand(dto),
    );
  }

  @Get(routersPaths.auth.me)
  @SkipThrottle()
  @ApiBearerAuth('bearerAuth')
  @UseBearerGuard()
  async me(@ExtractUserFromRequest() dto: UserFromRequestDataInputDto) {
    return {
      email: dto.email,
      login: dto.login,
      userId: dto.login,
    };
  }
}
