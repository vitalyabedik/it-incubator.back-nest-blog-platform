import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { IGetPostListParamsDto } from '../../infrastructure/query/dto/get-post-list.params.dto';
import { PostViewDto } from '../view-dto/posts.view-dto';
import { IGetPostListDto } from './dto/get-post-list.dto';

export class GetPostListQuery {
  constructor(public queryParams: IGetPostListDto) {}
}

@QueryHandler(GetPostListQuery)
export class GetPostListQueryHandler implements IQueryHandler<
  GetPostListQuery,
  PaginatedViewDto<PostViewDto[]>
> {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute({
    queryParams,
  }: GetPostListQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
    const { userId, query } = queryParams;

    const params: Omit<IGetPostListParamsDto, 'blogId'> = {
      userId,
      query: {
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
        limit: query.pageSize,
        offset: query.calculateSkip(),
      },
    };

    const { posts, totalCount } =
      await this.postsQueryRepository.getPostList(params);

    return PaginatedViewDto.mapToView({
      items: posts.map(PostViewDto.mapToView),
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
