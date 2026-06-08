import { Injectable } from '@nestjs/common';
import { SecurityDeviceCreateInputDto } from '../../api/input-dto/security-device.create-input-dto';
import { SecurityDeviceRepository } from '../../infrastructure/security-device.repository';

@Injectable()
export class SecurityDeviceFactory {
  constructor(private securityDeviceRepository: SecurityDeviceRepository) {}

  async createSession(dto: SecurityDeviceCreateInputDto): Promise<void> {
    await this.securityDeviceRepository.createSession(dto);
  }
}
