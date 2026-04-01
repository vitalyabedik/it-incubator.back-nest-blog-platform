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
import { ApiParam } from '@nestjs/swagger';
import { routersPaths } from '../../../../core/constants/paths';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ID_PARAMETER } from '../../../../core/constants/params';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';
import { GetCommentsQueryParams } from '../../comments/api/input-dto/get-comments-query-params.input-dto';
import { CommentViewDto } from '../../comments/api/view-dto/comments.view-dto';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from './view-dto/posts.view-dto';
import { CreatePostInputDto } from './input-dto/posts.create-input-dto';
import { UpdatePostInputDto } from './input-dto/posts.update-input-dto';

@Controller(routersPaths.posts.root)
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {
    console.log('PostsController created');
  }

  @Get()
  async getPostList(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getPostList({ query });
  }

  @Get(routersPaths.byId)
  async getPostById(@Param(ID_PARAMETER) id: string): Promise<PostViewDto> {
    return this.postsQueryRepository.getPostById({ postId: id });
  }

  @Post()
  async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.postsService.createPost(body);

    return this.postsQueryRepository.getPostById({ postId });
  }

  @ApiParam({ name: ID_PARAMETER })
  @Put(routersPaths.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param(ID_PARAMETER) id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    return this.postsService.updatePost(id, body);
  }

  @ApiParam({ name: ID_PARAMETER })
  @Delete(routersPaths.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param(ID_PARAMETER) id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }

  @Get(`${routersPaths.byId}/${routersPaths.comments.root}`)
  async getCommentListByPostId(
    @Param(ID_PARAMETER) id: string,
    @Query() query: GetCommentsQueryParams,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.commentsQueryRepository.getCommentListByPostId({
      postId: id,
      query,
    });
  }
}
