import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth } from '@nestjs/swagger';
import { routersPaths } from '../../../core/constants/paths';
import { AppThrottle } from '../../../core/decorators/throttle/app-throttle';
import { AuthService } from '../application/auth.service';
import { AuthLoginInputDto } from './input-dto/auth.login-input-dto';
import { AuthPasswordRecoveryInputDto } from './input-dto/auth.password-recovery-input-dto';
import { AuthNewPasswordInputDto } from './input-dto/auth.new-password-input-dto';
import { AuthRegistrationInputDto } from './input-dto/auth.registration-input-dto';
import { AuthRegistrationEmailResendingInputDto } from './input-dto/auth.registration-email-resending-input-dto';
import { AuthRegistrationConfirmationInputDto } from './input-dto/auth.registration-confirmation-input-dto';
import { UserFromRequestDataInputDto } from './input-dto/user-from-request-data-input.dto';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { BearerAuthGuard } from '../guards/bearer/bearer-auth.guard';

@AppThrottle()
@Controller(routersPaths.auth.root)
export class AuthController {
  constructor(private authService: AuthService) {
    console.log('AuthController created');
  }

  @Post(routersPaths.auth.login)
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthLoginInputDto) {
    return this.authService.login(dto);
  }

  @Post(routersPaths.auth.passwordRecovery)
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() dto: AuthPasswordRecoveryInputDto) {
    return this.authService.passwordRecovery(dto);
  }

  @Post(routersPaths.auth.newPassword)
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() dto: AuthNewPasswordInputDto) {
    return this.authService.newPassword(dto);
  }

  @Post(routersPaths.auth.registration)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: AuthRegistrationInputDto) {
    return this.authService.registration(dto);
  }

  @Post(routersPaths.auth.registrationConfirmation)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() dto: AuthRegistrationConfirmationInputDto,
  ) {
    return this.authService.registrationConfirmation(dto);
  }

  @Post(routersPaths.auth.registrationEmailResending)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() dto: AuthRegistrationEmailResendingInputDto,
  ) {
    return this.authService.registrationEmailResending(dto);
  }

  @Get(routersPaths.auth.me)
  @SkipThrottle()
  @ApiBearerAuth('bearerAuth')
  @UseGuards(BearerAuthGuard)
  async me(@ExtractUserFromRequest() dto: UserFromRequestDataInputDto) {
    return dto;
  }
}
