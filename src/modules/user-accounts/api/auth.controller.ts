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

import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { UseBearerGuard } from '../guards/decorators/use-bearer-guard.decorator';
import {
  LoginUserCommand,
  TLoginUserCommandOutput,
} from '../application/usecases/login-user.usecase';
import { PasswordRecoveryUserCommand } from '../application/usecases/password-recovery-user.usecase';
import { NewPasswordUserCommand } from '../application/usecases/new-password-user.usecase';
import { RegisterUserCommand } from '../application/usecases/register-user.usecase';
import { RegisterConfirmationUserCommand } from '../application/usecases/register-confirmation-user.usecase';
import { RegisterEmailResendingUserCommand } from '../application/usecases/register-email-resending-user.usecase';
import { AuthLoginInputDto } from './input-dto/auth.login-input-dto';
import { AuthPasswordRecoveryInputDto } from './input-dto/auth.password-recovery-input-dto';
import { AuthNewPasswordInputDto } from './input-dto/auth.new-password-input-dto';
import { AuthRegistrationInputDto } from './input-dto/auth.registration-input-dto';
import { AuthRegistrationEmailResendingInputDto } from './input-dto/auth.registration-email-resending-input-dto';
import { AuthRegistrationConfirmationInputDto } from './input-dto/auth.registration-confirmation-input-dto';
import { UserFromRequestDataInputDto } from './input-dto/user-from-request-data-input.dto';

@AppThrottle()
@Controller(routersPaths.auth.root)
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {
    console.log('AuthController created');
  }

  @Post(routersPaths.auth.login)
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthLoginInputDto, @Res() response: Response) {
    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginUserCommand,
      TLoginUserCommandOutput
    >(new LoginUserCommand(dto));

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    response.send({ accessToken });
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
    return dto;
  }
}
