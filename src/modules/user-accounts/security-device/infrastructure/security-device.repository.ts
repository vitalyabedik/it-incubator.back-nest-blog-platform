import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { errorMessages } from '../constants/texts';
import { ISecurityDeviceEntityDto } from '../domain/dto/security-device.entity.dto';
import { ICreateSecurityDeviceParamsDto } from './input-dto/create-security-device.params.dto';
import { IUpdateSecurityDeviceParamsDto } from './input-dto/update-security-device.params.dto';
import { IDeleteSecurityDeviceParamsDto } from './input-dto/delete-security-device.params.dto';

@Injectable()
export class SecurityDeviceRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findSessionByIdOrThrow(
    deviceId: string,
  ): Promise<ISecurityDeviceEntityDto> {
    const [securityDevice]: ISecurityDeviceEntityDto[] =
      await this.dataSource.query(
        `
      SELECT * 
        FROM "user_device_sessions"
        WHERE "deviceId" = $1
      `,
        [deviceId],
      );

    if (!securityDevice) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFoundSession,
      });
    }

    return securityDevice;
  }

  async createSession(dto: ICreateSecurityDeviceParamsDto): Promise<void> {
    const { userId, deviceId, deviceName, ip, iat, expirationAt } = dto;

    await this.dataSource.query(
      `
      INSERT INTO "user_device_sessions"
        ("userId", "deviceId", "deviceName", ip, iat, "expirationAt")
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [userId, deviceId, deviceName, ip, iat, expirationAt],
    );
  }

  async updateSession(dto: IUpdateSecurityDeviceParamsDto): Promise<boolean> {
    const { userId, deviceId, iat, newIat, newExpirationAt } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
      UPDATE "user_device_sessions"
        SET iat = $4, "expirationAt" = $5
        WHERE "userId" = $1 AND "deviceId" = $2 AND iat = $3
        RETURNING id
      `,
      [userId, deviceId, iat, newIat, newExpirationAt],
    );

    return rows.length > 0;
  }

  async deleteSessionListExceptTheCurrent(dto: {
    userId: string;
    deviceId: string;
  }): Promise<boolean> {
    const { userId, deviceId } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
      DELETE FROM "user_device_sessions"
        WHERE "userId" = $1 AND "deviceId" != $2
        RETURNING id
      `,
      [userId, deviceId],
    );

    return rows.length > 0;
  }

  async deleteSession(dto: IDeleteSecurityDeviceParamsDto): Promise<boolean> {
    const { userId, deviceId, iat } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
      DELETE FROM "user_device_sessions"
        WHERE "userId" = $1 AND "deviceId" = $2 AND iat = $3
        RETURNING id
      `,
      [userId, deviceId, iat],
    );

    return rows.length > 0;
  }
}
