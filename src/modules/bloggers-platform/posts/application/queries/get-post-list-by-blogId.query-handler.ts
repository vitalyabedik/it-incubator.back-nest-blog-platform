import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/query/blogs.query-repository';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { IGetPostListParamsDto } from '../../infrastructure/query/dto/get-post-list.params.dto';
import { PostViewDto } from '../view-dto/posts.view-dto';
import { IPostListByBlogIdDto } from './dto/get-post-list-by-blog-id.dto';

export class GetPostListByBlogIdQuery {
  constructor(public queryParams: IPostListByBlogIdDto) {}
}

@QueryHandler(GetPostListByBlogIdQuery)
export class GetPostListByBlogIdQueryHandler implements IQueryHandler<
  GetPostListByBlogIdQuery,
  PaginatedViewDto<PostViewDto[]>
> {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute({
    queryParams,
  }: GetPostListByBlogIdQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
    const { blogId, query, userId } = queryParams;

    await this.blogsQueryRepository.getBlogByIdOrThrow(blogId);

    const params: IGetPostListParamsDto = {
      blogId,
      userId,
      query: {
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
        limit: query.pageSize,
        offset: query.calculateSkip(),
      },
    };

    const { posts, totalCount } =
      await this.postsQueryRepository.getPostListByBlogId(params);

    return PaginatedViewDto.mapToView({
      items: posts.map(PostViewDto.mapToView),
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
