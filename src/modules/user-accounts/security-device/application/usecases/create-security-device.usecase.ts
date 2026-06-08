import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityDeviceCreateInputDto } from '../../api/input-dto/security-device.create-input-dto';
import { SecurityDeviceFactory } from '../factories/security-device.factory';

export class CreateSecurityDeviceCommand {
  constructor(public dto: SecurityDeviceCreateInputDto) {}
}

@CommandHandler(CreateSecurityDeviceCommand)
export class CreateSecurityDeviceUseCase implements ICommandHandler<
  CreateSecurityDeviceCommand,
  void
> {
  constructor(private securityDeviceFactory: SecurityDeviceFactory) {}

  async execute({ dto }: CreateSecurityDeviceCommand): Promise<void> {
    await this.securityDeviceFactory.createSession(dto);
  }
}
