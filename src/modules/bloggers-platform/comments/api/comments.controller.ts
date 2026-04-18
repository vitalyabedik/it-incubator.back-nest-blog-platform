import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiParam } from '@nestjs/swagger';
import { routersPaths } from '../../../../core/constants/paths';
import { ID_PARAMETER } from '../../../../core/constants/params';
import { ObjectIdValidationPipe } from '../../../../core/pipes/object-id-validation-transformation-pipe.service';
import { UseBearerGuard } from '../../..//user-accounts/guards/decorators/use-bearer-guard.decorator';
import { UseOptionalBearerGuard } from '../../../user-accounts/guards/decorators/use-optional-bearer-guard.decorator';
import { ExtractUserFromRequest } from '../../../user-accounts/guards/decorators/param/extract-user-from-request.decorator';
import { UserFromRequestDataInputDto } from '../../../user-accounts/api/input-dto/user-from-request-data-input.dto';
import { Public } from '../../../user-accounts/guards/decorators/public.decorator';
import { ExtractOptionalUserFromRequest } from '../../../user-accounts/guards/decorators/param/extract-optional-user-from-request.decorator';
import { CommentViewDto } from '../application/view-dto/comments.view-dto';
import { GetCommentByIdQuery } from '../application/queries/get-comment-by-postId.query-handler';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { UpdateCommentLikeStatusCommand } from '../application/usecases/update-comment-like-status.usecase';
import { UpdateCommentLikeStatusInputDto } from './input-dto/comment.update-like-status-input-dto';
import { UpdateCommentInputDto } from './input-dto/comment.update-input-dto';

@Controller(routersPaths.comments.root)
@UseBearerGuard()
export class CommentsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {
    console.log('CommentsController created');
  }

  @Get(routersPaths.byId)
  @UseOptionalBearerGuard()
  @Public()
  async getCommentById(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @ExtractOptionalUserFromRequest()
    userDto: UserFromRequestDataInputDto | null,
  ): Promise<CommentViewDto> {
    return this.queryBus.execute<GetCommentByIdQuery, CommentViewDto>(
      new GetCommentByIdQuery(id, userDto),
    );
  }

  @Put(routersPaths.byId)
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @Body() body: UpdateCommentInputDto,
    @ExtractUserFromRequest() userDto: UserFromRequestDataInputDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdateCommentCommand, void>(
      new UpdateCommentCommand(id, { ...body, ...userDto }),
    );
  }

  @Put(routersPaths.likeStatus)
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCommentLikeStatus(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @Body() body: UpdateCommentLikeStatusInputDto,
    @ExtractUserFromRequest() userDto: UserFromRequestDataInputDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdateCommentLikeStatusCommand, void>(
      new UpdateCommentLikeStatusCommand(id, {
        ...body,
        ...userDto,
      }),
    );
  }

  @Delete(routersPaths.byId)
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @ExtractUserFromRequest() userDto: UserFromRequestDataInputDto,
  ): Promise<void> {
    return this.commandBus.execute<DeleteCommentCommand, void>(
      new DeleteCommentCommand(id, userDto),
    );
  }
}
