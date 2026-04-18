import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { PostViewDto } from '../view-dto/posts.view-dto';
import { GetPostsListQueryRepositoryParams } from '../../infrastructure/query/input-dto/get-posts-list.query-repository.input-dto';

export class GetPostListQuery {
  constructor(public queryParams: GetPostsListQueryRepositoryParams) {}
}

@QueryHandler(GetPostListQuery)
export class GetPostListQueryHandler implements IQueryHandler<
  GetPostListQuery,
  PaginatedViewDto<PostViewDto[]>
> {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(
    query: GetPostListQuery,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getPostList(query.queryParams);
  }
}
