import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { routersPaths } from '../../../../core/constants/paths';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ID_PARAMETER } from '../../../../core/constants/params';
import { UUIDValidationPipe } from '../../../../core/pipes/uuid-validation-pipe';

import { UseOptionalBearerGuard } from '../../../user-accounts/auth/guards/decorators/use-optional-bearer-guard.decorator';
import { ExtractOptionalUserFromRequest } from '../../../user-accounts/auth/guards/decorators/param/extract-optional-user-from-request.decorator';
import { UserFromRequestDataInputDto } from '../../../user-accounts/users/api/input-dto/user-from-request-data-input.dto';

import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from '../../posts/application/view-dto/posts.view-dto';
import { GetPostListByBlogIdQuery } from '../../posts/application/queries/get-post-list-by-blogId.query-handler';

import { BlogViewDto } from '../application/view-dto/blogs.view-dto';
import { GetBlogByIdQuery } from '../application/queries/get-blog-by-id.query-handler';
import { GetBlogListQuery } from '../application/queries/get-blog-list.query-handler';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';

@Controller(routersPaths.blogs.root)
export class BlogsController {
  constructor(private readonly queryBus: QueryBus) {
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
    @Param(ID_PARAMETER, UUIDValidationPipe) id: string,
  ): Promise<BlogViewDto> {
    return this.queryBus.execute<GetBlogByIdQuery, BlogViewDto>(
      new GetBlogByIdQuery(id),
    );
  }

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
}
