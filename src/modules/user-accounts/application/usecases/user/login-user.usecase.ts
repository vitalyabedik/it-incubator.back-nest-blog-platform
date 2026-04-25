import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { ClientInfoDto } from '../../../../../core/decorators/client-info/extract-client-info';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../../constants/texts';
import { UserLoginInputDto } from '../../input-dto/user/user-login.input-dto';
import { TokenService } from '../../token.service';
import { AuthService } from '../../auth.service';
import { CreateSecurityDeviceCommand } from '../security-device/create-security-device.usecase';

export type TLoginUserCommandOutput = {
  accessToken: string | null;
  refreshToken: string;
};

export class LoginUserCommand {
  constructor(
    public clientMetaDto: ClientInfoDto,
    public userDto: UserLoginInputDto,
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<
  LoginUserCommand,
  TLoginUserCommandOutput
> {
  constructor(
    private commandBus: CommandBus,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  async execute({
    clientMetaDto,
    userDto,
  }: LoginUserCommand): Promise<TLoginUserCommandOutput> {
    const user = await this.authService.validateUserCredentials(userDto);

    if (!user) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: errorMessages.unauthorized,
      });
    }

    const deviceId = new Types.ObjectId().toString();

    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshTokenWithMeta =
      await this.tokenService.createRefreshTokenWithInfo({
        ...user,
        deviceId,
      });

    if (!refreshTokenWithMeta) {
      throw new DomainException({
        code: EDomainExceptionCode.InternalServerError,
        message: errorMessages.refreshToken,
      });
    }

    const { ip, deviceName } = clientMetaDto;
    const { iat, expirationAt, refreshToken } = refreshTokenWithMeta;

    await this.commandBus.execute<CreateSecurityDeviceCommand, string>(
      new CreateSecurityDeviceCommand({
        userId: user.userId,
        deviceId,
        ip,
        deviceName,
        iat,
        expirationAt,
      }),
    );

    return { accessToken, refreshToken };
  }
}
