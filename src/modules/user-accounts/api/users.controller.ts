import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { ID_PARAMETER } from '../../../core/constants/params';
import { routersPaths } from '../../../core/constants/paths';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { UsersService } from '../application/users.service';
import { UserViewDto } from './view-dto/users.view-dto';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';

@Controller(routersPaths.users.root)
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {
    console.log('UsersController created');
  }

  @Get()
  async getUserList(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getUserList(query);
  }

  @Post()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.usersService.createUser(body);

    return this.usersQueryRepository.getUserById(userId);
  }

  @ApiParam({ name: ID_PARAMETER })
  @Delete(routersPaths.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param(ID_PARAMETER) id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
