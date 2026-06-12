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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBasicAuth, ApiParam } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ID_PARAMETER } from '../../../../core/constants/params';
import { routersPaths } from '../../../../core/constants/paths';
import { UUIDValidationPipe } from '../../../../core/pipes/uuid-validation-pipe';
import { UseBasicGuard } from '../../auth/guards/decorators/use-basic-guard.decorator';
import { UserViewDto } from '../application/view-dto/users.view-dto';
import { GetUserListQuery } from '../application/queries/get-user-list.query-handler';
import { CreateUserCommand } from '../application/usecases/create-user.usecase';
import { DeleteUserCommand } from '../application/usecases/delete-user.usecase';
import { CreateUserInputDto } from './input-dto/users.create-input-dto';
import { GetUsersQueryParamsDto } from './input-dto/get-users-query-params.input-dto';

@Controller(`${routersPaths.sa}/${routersPaths.users.root}`)
@UseBasicGuard()
@ApiBasicAuth('basicAuth')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    console.log('UsersController created');
  }

  @Get()
  async getUserList(
    @Query() query: GetUsersQueryParamsDto,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.queryBus.execute<
      GetUserListQuery,
      PaginatedViewDto<UserViewDto[]>
    >(new GetUserListQuery(query));
  }

  @Post()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    return this.commandBus.execute(new CreateUserCommand(body));
  }

  @ApiParam({ name: ID_PARAMETER })
  @Delete(routersPaths.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
  ): Promise<void> {
    return this.commandBus.execute<DeleteUserCommand, void>(
      new DeleteUserCommand(id),
    );
  }
}
