import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  TSecurityDeviceModel,
  SecurityDevice,
} from '../../domain/security-device.entity';
import { SecurityDeviceViewDto } from '../../application/view-dto/security-device.view-dto';

@Injectable()
export class SecurityDeviceQueryRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private SecurityDeviceModel: TSecurityDeviceModel,
  ) {}

  async getSecurityDeviceListByUserId(
    userId: string,
  ): Promise<SecurityDeviceViewDto[]> {
    const items = await this.SecurityDeviceModel.find({ userId }).lean().exec();

    const securityDevicesViewList = items.map(SecurityDeviceViewDto.mapToView);

    return securityDevicesViewList;
  }
}
