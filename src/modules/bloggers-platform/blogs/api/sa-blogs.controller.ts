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
import {
  ID_PARAMETER,
  POST_ID_PARAMETER,
} from '../../../../core/constants/params';
import { UUIDValidationPipe } from '../../../../core/pipes/uuid-validation-pipe';

import { UseBasicGuard } from '../../../user-accounts/auth/guards/decorators/use-basic-guard.decorator';
import { UseOptionalBearerGuard } from '../../../user-accounts/auth/guards/decorators/use-optional-bearer-guard.decorator';
import { ExtractOptionalUserFromRequest } from '../../../user-accounts/auth/guards/decorators/param/extract-optional-user-from-request.decorator';
import { UserFromRequestDataInputDto } from '../../../user-accounts/users/api/input-dto/user-from-request-data-input.dto';

import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from '../../posts/application/view-dto/posts.view-dto';
import { GetPostListByBlogIdQuery } from '../../posts/application/queries/get-post-list-by-blogId.query-handler';
import { CreatePostCommand } from '../../posts/application/usecases/create-post.usecase';
import { UpdatePostCommand } from '../../posts/application/usecases/update-post.usecase';
import { DeletePostCommand } from '../../posts/application/usecases/delete-post.usecase';
import { UpdatePostInputDto } from '../../posts/api/input-dto/posts.update-input-dto';

import { BlogViewDto } from '../application/view-dto/blogs.view-dto';
import { GetBlogListQuery } from '../application/queries/get-blog-list.query-handler';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { CreateBlogInputDto } from './input-dto/blogs.create-input-dto';
import { UpdateBlogInputDto } from './input-dto/blogs.update-input-dto';
import { CreatePostByBlogIdInputDto } from './input-dto/blogs.create-post-by-blogId-dto';

@UseBasicGuard()
@Controller(`${routersPaths.sa}/${routersPaths.blogs.root}`)
export class SuperAdminBlogsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {
    console.log('SuperAdminBlogsController created');
  }

  /**
   * Blogs
   */
  @Get()
  async getBlogList(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.queryBus.execute<
      GetBlogListQuery,
      PaginatedViewDto<BlogViewDto[]>
    >(new GetBlogListQuery(query));
  }

  @Post()
  async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    return this.commandBus.execute<CreateBlogCommand, BlogViewDto>(
      new CreateBlogCommand(body),
    );
  }

  @Put(routersPaths.byId)
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
    @Body() body: UpdateBlogInputDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdateBlogCommand, void>(
      new UpdateBlogCommand({ blogId: id, ...body }),
    );
  }

  @Delete(routersPaths.byId)
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
  ): Promise<void> {
    return this.commandBus.execute<DeleteBlogCommand, void>(
      new DeleteBlogCommand(id),
    );
  }

  /**
   * Posts
   */
  @Get(`${routersPaths.byId}/${routersPaths.posts.root}`)
  @UseOptionalBearerGuard()
  async getPostListByBlogId(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
    @Query() query: GetPostsQueryParams,
    @ExtractOptionalUserFromRequest()
    userDto: UserFromRequestDataInputDto | null,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.queryBus.execute<
      GetPostListByBlogIdQuery,
      PaginatedViewDto<PostViewDto[]>
    >(
      new GetPostListByBlogIdQuery({
        blogId: id,
        query,
        userId: userDto?.userId,
      }),
    );
  }

  @Post(`${routersPaths.byId}/${routersPaths.posts.root}`)
  async createPostByBlogId(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
    @Body() body: CreatePostByBlogIdInputDto,
  ): Promise<PostViewDto> {
    return this.commandBus.execute<CreatePostCommand, PostViewDto>(
      new CreatePostCommand({
        ...body,
        blogId: id,
      }),
    );
  }

  @Put(
    `${routersPaths.byId}/${routersPaths.posts.root}/${routersPaths.byPostId}`,
  )
  @ApiParam({ name: ID_PARAMETER })
  @ApiParam({ name: POST_ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
    @Param(POST_ID_PARAMETER, UUIDValidationPipe) postId: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdatePostCommand, void>(
      new UpdatePostCommand({ blogId: id, postId, ...body }),
    );
  }

  @Delete(
    `${routersPaths.byId}/${routersPaths.posts.root}/${routersPaths.byPostId}`,
  )
  @ApiParam({ name: ID_PARAMETER })
  @ApiParam({ name: POST_ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
    @Param(POST_ID_PARAMETER, UUIDValidationPipe) postId: string,
  ): Promise<void> {
    return this.commandBus.execute<DeletePostCommand, void>(
      new DeletePostCommand({ blogId: id, postId }),
    );
  }
}
