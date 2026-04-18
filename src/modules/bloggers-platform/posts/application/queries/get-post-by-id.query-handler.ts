import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { GetPostByIdQueryRepositoryParams } from '../../infrastructure/query/input-dto/get-post-by-id.query-repository.input-dto';
import { PostViewDto } from '../view-dto/posts.view-dto';

export class GetPostByIdQuery {
  constructor(public queryParams: GetPostByIdQueryRepositoryParams) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler implements IQueryHandler<
  GetPostByIdQuery,
  PostViewDto
> {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(query: GetPostByIdQuery): Promise<PostViewDto> {
    return this.postsQueryRepository.getPostById(query.queryParams);
  }
}
