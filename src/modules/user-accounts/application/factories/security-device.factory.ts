import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevice,
  TSecurityDeviceModel,
  TSecurityDeviceDocument,
} from '../../domain/security-device.entity';
import { SecurityDeviceCreateInputDto } from '../../api/input-dto/security-device/security-device.create-input-dto';

@Injectable()
export class SecurityDeviceFactory {
  constructor(
    @InjectModel(SecurityDevice.name)
    private SecurityDeviceModel: TSecurityDeviceModel,
  ) {}

  async createSecurityDevice(
    dto: SecurityDeviceCreateInputDto,
  ): Promise<TSecurityDeviceDocument> {
    const newSecurityDevice = this.SecurityDeviceModel.createInstance(dto);

    return newSecurityDevice;
  }
}
