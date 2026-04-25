import { TSecurityDeviceDocument } from './../../domain/security-device.entity';

export class SecurityDeviceViewDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  static mapToView(
    securityDevice: TSecurityDeviceDocument,
  ): SecurityDeviceViewDto {
    const dto = new SecurityDeviceViewDto();

    dto.ip = securityDevice.ip;
    dto.title = securityDevice.deviceName;
    dto.deviceId = securityDevice.deviceId;
    dto.lastActiveDate = new Date(securityDevice.iat * 1000).toISOString();

    return dto;
  }
}
