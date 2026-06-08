import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ISecurityDeviceEntityDto } from '../../domain/dto/security-device.entity.dto';

@Injectable()
export class SecurityDeviceQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getSecurityDeviceListByUserId(
    userId: string,
  ): Promise<ISecurityDeviceEntityDto[]> {
    return this.dataSource.query(
      `
          SELECT *
            FROM "user_device_sessions"
            WHERE "userId" = $1
      `,
      [userId],
    );
  }
}
