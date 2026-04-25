import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { EDomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { errorMessages } from '../constants/texts';
import {
  SecurityDevice,
  TSecurityDeviceModel,
  TSecurityDeviceDocument,
} from '../domain/security-device.entity';
import { GetSecurityDeviceQueryParams } from '../api/input-dto/security-device/get-security-device-query-params.input-dto';

@Injectable()
export class SecurityDeviceRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private SecurityDeviceModel: TSecurityDeviceModel,
  ) {}

  async findSecurityDeviceByIdOrThrow(
    deviceId: string,
  ): Promise<TSecurityDeviceDocument> {
    const securityDevice = await this.SecurityDeviceModel.findOne({
      deviceId,
    }).exec();

    if (!securityDevice) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return securityDevice;
  }

  async findSecurityDeviceByFilter(
    query: GetSecurityDeviceQueryParams,
  ): Promise<TSecurityDeviceDocument | null> {
    const { userId, deviceId, iat } = query;

    const securityDevice = await this.SecurityDeviceModel.findOne({
      userId,
      deviceId,
      iat,
    }).exec();

    return securityDevice;
  }

  async deleteSecurityDeviceListExceptTheCurrent(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    await this.SecurityDeviceModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    }).exec();
  }

  async deleteSecurityDeviceByDeviceIdAndUserId(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    await this.SecurityDeviceModel.deleteOne({
      userId,
      deviceId,
    }).exec();
  }

  async save(securityDevice: TSecurityDeviceDocument) {
    await securityDevice.save();
  }
}
