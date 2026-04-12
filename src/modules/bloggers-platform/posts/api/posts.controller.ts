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

import { GetCommentsQueryParams } from '../../comments/api/input-dto/get-comments-query-params.input-dto';
import { GetCommentListByPostIdQuery } from '../../comments/application/queries/get-comment-list-by-postId.query-handler';
import { CommentViewDto } from '../../comments/application/view-dto/comments.view-dto';

import { PostViewDto } from '../application/view-dto/posts.view-dto';
import { GetPostListQuery } from '../application/queries/get-post-list.query-handler';
import { GetPostByIdQuery } from '../application/queries/get-post-by-id.query-handler';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { CreatePostInputDto } from './input-dto/posts.create-input-dto';
import { UpdatePostInputDto } from './input-dto/posts.update-input-dto';

@Controller(routersPaths.posts.root)
export class PostsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {
    console.log('PostsController created');
  }

  @Get()
  async getPostList(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.queryBus.execute<
      GetPostListQuery,
      PaginatedViewDto<PostViewDto[]>
    >(new GetPostListQuery({ query }));
  }

  @Get(routersPaths.byId)
  async getPostById(@Param(ID_PARAMETER) id: string): Promise<PostViewDto> {
    return this.queryBus.execute<GetPostByIdQuery, PostViewDto>(
      new GetPostByIdQuery({ postId: id }),
    );
  }

  @Post()
  async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.commandBus.execute<CreatePostCommand, string>(
      new CreatePostCommand(body),
    );

    return this.queryBus.execute<GetPostByIdQuery, PostViewDto>(
      new GetPostByIdQuery({ postId }),
    );
  }

  @ApiParam({ name: ID_PARAMETER })
  @Put(routersPaths.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param(ID_PARAMETER) id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdatePostCommand, void>(
      new UpdatePostCommand(id, body),
    );
  }

  @ApiParam({ name: ID_PARAMETER })
  @Delete(routersPaths.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param(ID_PARAMETER) id: string): Promise<void> {
    return this.commandBus.execute<DeletePostCommand, void>(
      new DeletePostCommand(id),
    );
  }

  @Get(`${routersPaths.byId}/${routersPaths.comments.root}`)
  async getCommentListByPostId(
    @Param(ID_PARAMETER) id: string,
    @Query() query: GetCommentsQueryParams,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.queryBus.execute<
      GetCommentListByPostIdQuery,
      PaginatedViewDto<CommentViewDto[]>
    >(
      new GetCommentListByPostIdQuery({
        postId: id,
        query,
      }),
    );
  }
}
