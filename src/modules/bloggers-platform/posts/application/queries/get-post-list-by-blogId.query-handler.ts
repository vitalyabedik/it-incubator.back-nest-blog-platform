import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { GetPostsListByBlogIdQueryRepositoryParams } from '../../infrastructure/query/input-dto/get-posts-list-by-blogId.query-repository.input-dto';
import { PostViewDto } from '../view-dto/posts.view-dto';

export class GetPostListByBlogIdQuery {
  constructor(public queryParams: GetPostsListByBlogIdQueryRepositoryParams) {}
}

@QueryHandler(GetPostListByBlogIdQuery)
export class GetPostListByBlogIdQueryHandler implements IQueryHandler<
  GetPostListByBlogIdQuery,
  PaginatedViewDto<PostViewDto[]>
> {
  constructor(
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute(
    query: GetPostListByBlogIdQuery,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getPostListByBlogId(query.queryParams);
  }
}
