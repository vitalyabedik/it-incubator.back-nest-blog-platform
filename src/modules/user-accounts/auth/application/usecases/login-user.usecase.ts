import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { ClientInfoDto } from '../../../../../core/decorators/client-info/extract-client-info';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages as userErrorMessages } from '../../../users/constants/texts';
import { UserLoginInputDto } from '../../../auth/application/input-dto/user-login.input-dto';
import { UsersService } from '../../../users/application/services/users.service';
import { CreateSecurityDeviceCommand } from '../../../security-device/application/usecases/create-security-device.usecase';
import { errorMessages } from '../../constants/texts';
import { TokenService } from '../services/token.service';

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
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async execute({
    clientMetaDto,
    userDto,
  }: LoginUserCommand): Promise<TLoginUserCommandOutput> {
    const user = await this.usersService.validateUserCredentials(userDto);

    if (!user) {
      throw new DomainException({
        code: EDomainExceptionCode.Unauthorized,
        message: userErrorMessages.unauthorized,
      });
    }

    const newDeviceId = randomUUID();
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshTokenWithMeta =
      await this.tokenService.createRefreshTokenWithInfo({
        ...user,
        deviceId: newDeviceId,
      });

    if (!refreshTokenWithMeta) {
      throw new DomainException({
        code: EDomainExceptionCode.InternalServerError,
        message: errorMessages.refreshToken,
      });
    }

    const { ip, deviceName } = clientMetaDto;
    const { iat, expirationAt, deviceId, refreshToken } = refreshTokenWithMeta;

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
