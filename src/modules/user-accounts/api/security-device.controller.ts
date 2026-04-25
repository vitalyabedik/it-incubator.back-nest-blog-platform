import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiParam } from '@nestjs/swagger';
import { ID_PARAMETER } from '../../../core/constants/params';
import { routersPaths } from '../../../core/constants/paths';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation-transformation-pipe.service';
import { ExtractCookies } from '../../../core/decorators/cookies/extract-cookies';
import { SecurityDeviceViewDto } from '../application/view-dto/security-device.view-dto';
import { GetSecurityDeviceListByUserIdQuery } from '../application/queries/security-device/get-security-device-list-by-userId.query-handler';
import { DeleteSecurityDeviceListExceptCurrentCommand } from '../application/usecases/security-device/delete-security-device-list-except-current.usecase';
import { DeleteSecurityDeviceByDeviceIdCommand } from '../application/usecases/security-device/delete-security-device-by-deviceId.usecase';

@Controller(`${routersPaths.security.root}/${routersPaths.security.devices}`)
export class SecurityDeviceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    console.log('SecurityDeviceController created');
  }

  @Get()
  async getSecurityDeviceListByUserId(
    @ExtractCookies('refreshToken') refreshToken: string,
  ): Promise<SecurityDeviceViewDto[]> {
    return this.queryBus.execute<
      GetSecurityDeviceListByUserIdQuery,
      SecurityDeviceViewDto[]
    >(new GetSecurityDeviceListByUserIdQuery(refreshToken));
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSecurityDeviceListExceptCurrent(
    @ExtractCookies('refreshToken') refreshToken: string,
  ): Promise<boolean> {
    return this.commandBus.execute<
      DeleteSecurityDeviceListExceptCurrentCommand,
      boolean
    >(new DeleteSecurityDeviceListExceptCurrentCommand(refreshToken));
  }

  @ApiParam({ name: ID_PARAMETER })
  @Delete(routersPaths.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSecurityDeviceByDeviceId(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @ExtractCookies('refreshToken') refreshToken: string,
  ): Promise<boolean> {
    return this.commandBus.execute<
      DeleteSecurityDeviceByDeviceIdCommand,
      boolean
    >(new DeleteSecurityDeviceByDeviceIdCommand(id, refreshToken));
  }
}
