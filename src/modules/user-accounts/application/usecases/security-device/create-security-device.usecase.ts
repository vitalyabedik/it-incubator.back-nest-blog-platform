import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityDeviceCreateInputDto } from '../../../api/input-dto/security-device/security-device.create-input-dto';
import { SecurityDeviceRepository } from '../../../infrastructure/security-device.repository';
import { SecurityDeviceFactory } from '../../factories/security-device.factory';

export class CreateSecurityDeviceCommand {
  constructor(public dto: SecurityDeviceCreateInputDto) {}
}

@CommandHandler(CreateSecurityDeviceCommand)
export class CreateSecurityDeviceUseCase implements ICommandHandler<
  CreateSecurityDeviceCommand,
  string
> {
  constructor(
    private securityDeviceRepository: SecurityDeviceRepository,
    private securityDeviceFactory: SecurityDeviceFactory,
  ) {}

  async execute({ dto }: CreateSecurityDeviceCommand): Promise<string> {
    const createdSecurityDevice =
      await this.securityDeviceFactory.createSecurityDevice(dto);

    await this.securityDeviceRepository.save(createdSecurityDevice);

    return createdSecurityDevice._id.toString();
  }
}
