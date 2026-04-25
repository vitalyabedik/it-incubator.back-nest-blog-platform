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

import { UseBasicGuard } from '../../../user-accounts/guards/decorators/use-basic-guard.decorator';
import { UseOptionalBearerGuard } from '../../../user-accounts/guards/decorators/use-optional-bearer-guard.decorator';
import { ExtractOptionalUserFromRequest } from '../../../user-accounts/guards/decorators/param/extract-optional-user-from-request.decorator';
import { UserFromRequestDataInputDto } from '../../../user-accounts/api/input-dto/user/user-from-request-data-input.dto';

import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from '../../posts/application/view-dto/posts.view-dto';
import { CreatePostByBlogIdInputDto } from './input-dto/blogs.create-post-by-blogId-dto';
import { GetPostListByBlogIdQuery } from '../../posts/application/queries/get-post-list-by-blogId.query-handler';
import { CreatePostCommand } from '../../posts/application/usecases/create-post.usecase';
import { GetPostByIdQuery } from '../../posts/application/queries/get-post-by-id.query-handler';

import { BlogViewDto } from '../application/view-dto/blogs.view-dto';
import { GetBlogByIdQuery } from '../application/queries/get-blog-by-id.query-handler';
import { GetBlogListQuery } from '../application/queries/get-blog-list.query-handler';
import { FindBlogByIdQuery } from '../application/queries/find-blog-by-id.query-handler';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { TBlogDocument } from '../domain/blog.entity';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { CreateBlogInputDto } from './input-dto/blogs.create-input-dto';
import { UpdateBlogInputDto } from './input-dto/blogs.update-input-dto';

@Controller(routersPaths.blogs.root)
export class BlogsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {
    console.log('BlogsController created');
  }

  @Get()
  async getBlogList(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.queryBus.execute<
      GetBlogListQuery,
      PaginatedViewDto<BlogViewDto[]>
    >(new GetBlogListQuery(query));
  }

  @Get(routersPaths.byId)
  async getBlogById(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
  ): Promise<BlogViewDto> {
    return this.queryBus.execute<GetBlogByIdQuery, BlogViewDto>(
      new GetBlogByIdQuery(id),
    );
  }

  @Post()
  @UseBasicGuard()
  async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.commandBus.execute<CreateBlogCommand, string>(
      new CreateBlogCommand(body),
    );

    return this.queryBus.execute<GetBlogByIdQuery, BlogViewDto>(
      new GetBlogByIdQuery(blogId),
    );
  }

  @Put(routersPaths.byId)
  @UseBasicGuard()
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @Body() body: UpdateBlogInputDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdateBlogCommand, void>(
      new UpdateBlogCommand(id, body),
    );
  }

  @Delete(routersPaths.byId)
  @UseBasicGuard()
  @ApiParam({ name: ID_PARAMETER })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    return this.commandBus.execute<DeleteBlogCommand, void>(
      new DeleteBlogCommand(id),
    );
  }

  @Get(`${routersPaths.byId}/${routersPaths.posts.root}`)
  @UseOptionalBearerGuard()
  async getPostListByBlogId(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @Query() query: GetPostsQueryParams,
    @ExtractOptionalUserFromRequest()
    userDto: UserFromRequestDataInputDto | null,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.queryBus.execute<FindBlogByIdQuery, TBlogDocument>(
      new FindBlogByIdQuery(id),
    );

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
  @UseBasicGuard()
  async createPostByBlogId(
    @Param(ID_PARAMETER, ObjectIdValidationPipe) id: string,
    @Body() body: CreatePostByBlogIdInputDto,
  ): Promise<PostViewDto> {
    const postId = await this.commandBus.execute<CreatePostCommand, string>(
      new CreatePostCommand({
        ...body,
        blogId: id,
      }),
    );

    return this.queryBus.execute<GetPostByIdQuery, PostViewDto>(
      new GetPostByIdQuery({ postId }),
    );
  }
}
