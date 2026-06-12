import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { IGetBlogListQueryDto } from '../dto/get-blog-list-query.dto';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';
import { IGetBlogListParamsDto } from '../../infrastructure/query/dto/get-blog-list.params.dto';
import { BlogViewDto } from '../view-dto/blogs.view-dto';

export class GetBlogListQuery {
  constructor(public queryParams: IGetBlogListQueryDto) {}
}

@QueryHandler(GetBlogListQuery)
export class GetBlogListQueryHandler implements IQueryHandler<
  GetBlogListQuery,
  PaginatedViewDto<BlogViewDto[]>
> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute({
    queryParams,
  }: GetBlogListQuery): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const params: IGetBlogListParamsDto = {
      searchNameTerm: queryParams.searchNameTerm,
      sortBy: queryParams.sortBy,
      sortDirection: queryParams.sortDirection,
      limit: queryParams.pageSize,
      offset: queryParams.calculateSkip(),
    };

    const { blogs, totalCount } =
      await this.blogsQueryRepository.getBlogList(params);

    const blogsViewList = blogs.map(BlogViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: blogsViewList,
      totalCount,
      page: queryParams.pageNumber,
      size: queryParams.pageSize,
    });
  }
}
