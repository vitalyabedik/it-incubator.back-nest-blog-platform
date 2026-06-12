import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiParam } from '@nestjs/swagger';

import { routersPaths } from '../../../../core/constants/paths';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ID_PARAMETER } from '../../../../core/constants/params';
import { UUIDValidationPipe } from '../../../../core/pipes/uuid-validation-pipe';

import { UseOptionalBearerGuard } from '../../../user-accounts/auth/guards/decorators/use-optional-bearer-guard.decorator';
import { UseBearerGuard } from '../../../user-accounts/auth/guards/decorators/use-bearer-guard.decorator';
import { Public } from '../../../user-accounts/auth/guards/decorators/public.decorator';
import { ExtractUserFromRequest } from '../../../user-accounts/auth/guards/decorators/param/extract-user-from-request.decorator';
import { ExtractOptionalUserFromRequest } from '../../../user-accounts/auth/guards/decorators/param/extract-optional-user-from-request.decorator';
import { UserFromRequestDataInputDto } from '../../../user-accounts/users/api/input-dto/user-from-request-data-input.dto';

import { GetCommentsQueryParams } from '../../comments/api/input-dto/get-comments-query-params.input-dto';
import { GetCommentListByPostIdQuery } from '../application/queries/get-comment-list-by-postId.query-handler';
import { CommentViewDto } from '../../comments/application/view-dto/comments.view-dto';
import { CreateCommentInputDto } from '../../comments/api/input-dto/comment.create-input-dto';

import { PostViewDto } from '../application/view-dto/posts.view-dto';
import { GetPostListQuery } from '../application/queries/get-post-list.query-handler';
import { GetPostByIdQuery } from '../application/queries/get-post-by-id.query-handler';
import { UpdatePostLikeStatusCommand } from '../application/usecases/update-post-like-status.usecase';
import { CreateCommentByPostIdCommand } from '../application/usecases/create-comment-by-post-id.usecase';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { UpdatePostLikeStatusInputDto } from './input-dto/posts.update-like-status-input-dto';

@Controller(routersPaths.posts.root)
export class PostsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {
    console.log('PostsController created');
  }

  @Get()
  @UseOptionalBearerGuard()
  async getPostList(
    @Query() query: GetPostsQueryParams,
    @ExtractOptionalUserFromRequest()
    userDto: UserFromRequestDataInputDto | null,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.queryBus.execute<
      GetPostListQuery,
      PaginatedViewDto<PostViewDto[]>
    >(new GetPostListQuery({ query, userId: userDto?.userId }));
  }

  @Get(routersPaths.byId)
  @UseOptionalBearerGuard()
  async getPostById(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
    @ExtractOptionalUserFromRequest()
    userDto: UserFromRequestDataInputDto | null,
  ): Promise<PostViewDto> {
    return this.queryBus.execute<GetPostByIdQuery, PostViewDto>(
      new GetPostByIdQuery({
        postId: id,
        userId: userDto?.userId,
      }),
    );
  }

  @Post(routersPaths.posts.commentsByPostId)
  @UseBearerGuard()
  async createCommentByPostId(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
    @Body() body: CreateCommentInputDto,
    @ExtractUserFromRequest() userDto: UserFromRequestDataInputDto,
  ): Promise<CommentViewDto> {
    return this.commandBus.execute<
      CreateCommentByPostIdCommand,
      CommentViewDto
    >(
      new CreateCommentByPostIdCommand({
        postId: id,
        userId: userDto.userId,
        login: userDto.login,
        content: body.content,
      }),
    );
  }

  @Put(routersPaths.likeStatus)
  @UseBearerGuard()
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostLikeStatus(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
    @Body() body: UpdatePostLikeStatusInputDto,
    @ExtractUserFromRequest() userDto: UserFromRequestDataInputDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdatePostLikeStatusCommand, void>(
      new UpdatePostLikeStatusCommand({
        postId: id,
        userId: userDto.userId,
        likeStatus: body.likeStatus,
      }),
    );
  }

  @Get(`${routersPaths.byId}/${routersPaths.comments.root}`)
  @Public()
  @UseOptionalBearerGuard()
  async getCommentListByPostId(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
    @Query() query: GetCommentsQueryParams,
    @ExtractOptionalUserFromRequest()
    userDto: UserFromRequestDataInputDto | null,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.queryBus.execute<
      GetCommentListByPostIdQuery,
      PaginatedViewDto<CommentViewDto[]>
    >(
      new GetCommentListByPostIdQuery({
        postId: id,
        userId: userDto?.userId,
        query,
      }),
    );
  }
}
