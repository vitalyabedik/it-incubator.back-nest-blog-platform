import {
  Body,
  Controller,
  Delete,
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
import { ObjectIdValidationPipe } from '../../../../core/pipes/object-id-validation-transformation-pipe.service';

import { UseOptionalBearerGuard } from '../../../user-accounts/guards/decorators/use-optional-bearer-guard.decorator';
import { UseBasicGuard } from '../../../user-accounts/guards/decorators/use-basic-guard.decorator';
import { UseBearerGuard } from '../../../user-accounts/guards/decorators/use-bearer-guard.decorator';
import { Public } from '../../../user-accounts/guards/decorators/public.decorator';
import { ExtractUserFromRequest } from '../../../user-accounts/guards/decorators/param/extract-user-from-request.decorator';
import { UserFromRequestDataInputDto } from '../../../user-accounts/api/input-dto/user-from-request-data-input.dto';
import { ExtractOptionalUserFromRequest } from '../../../user-accounts/guards/decorators/param/extract-optional-user-from-request.decorator';

import { GetCommentsQueryParams } from '../../comments/api/input-dto/get-comments-query-params.input-dto';
import { GetCommentListByPostIdQuery } from '../../comments/application/queries/get-comment-list-by-postId.query-handler';
import { CommentViewDto } from '../../comments/application/view-dto/comments.view-dto';
import { CreateCommentInputDto } from '../../comments/api/input-dto/comment.create-input-dto';
import { CreateCommentCommand } from '../../comments/application/usecases/create-comment.usecase';
import { GetCommentByIdQuery } from '../../comments/application/queries/get-comment-by-postId.query-handler';

import { PostViewDto } from '../application/view-dto/posts.view-dto';
import { GetPostListQuery } from '../application/queries/get-post-list.query-handler';
import { GetPostByIdQuery } from '../application/queries/get-post-by-id.query-handler';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { CreatePostInputDto } from './input-dto/posts.create-input-dto';
import { UpdatePostInputDto } from './input-dto/posts.update-input-dto';
import { UpdatePostLikeStatusInputDto } from './input-dto/posts.update-like-status-input-dto';
import { UpdatePostLikeStatusCommand } from '../application/usecases/update-post-like-status.usecase';

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
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
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

  @Post()
  @UseBasicGuard()
  async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.commandBus.execute<CreatePostCommand, string>(
      new CreatePostCommand(body),
    );

    return this.queryBus.execute<GetPostByIdQuery, PostViewDto>(
      new GetPostByIdQuery({ postId }),
    );
  }

  @Post(routersPaths.posts.commentsByPostId)
  @UseBearerGuard()
  async createCommentByPostId(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @Body() body: CreateCommentInputDto,
    @ExtractUserFromRequest() userDto: UserFromRequestDataInputDto,
  ): Promise<CommentViewDto> {
    const { userId, login } = userDto;

    const commentId = await this.commandBus.execute<
      CreateCommentCommand,
      string
    >(new CreateCommentCommand(id, { userId, userLogin: login }, body));

    return this.queryBus.execute<GetCommentByIdQuery, CommentViewDto>(
      new GetCommentByIdQuery(commentId, userDto),
    );
  }

  @Put(routersPaths.byId)
  @UseBasicGuard()
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdatePostCommand, void>(
      new UpdatePostCommand(id, body),
    );
  }

  @Put(routersPaths.likeStatus)
  @UseBearerGuard()
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostLikeStatus(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @Body() body: UpdatePostLikeStatusInputDto,
    @ExtractUserFromRequest() userDto: UserFromRequestDataInputDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdatePostLikeStatusCommand, void>(
      new UpdatePostLikeStatusCommand(id, {
        ...body,
        userId: userDto.userId,
        login: userDto.login,
      }),
    );
  }

  @Delete(routersPaths.byId)
  @UseBasicGuard()
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    return this.commandBus.execute<DeletePostCommand, void>(
      new DeletePostCommand(id),
    );
  }

  @Get(`${routersPaths.byId}/${routersPaths.comments.root}`)
  @Public()
  @UseOptionalBearerGuard()
  async getCommentListByPostId(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
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
