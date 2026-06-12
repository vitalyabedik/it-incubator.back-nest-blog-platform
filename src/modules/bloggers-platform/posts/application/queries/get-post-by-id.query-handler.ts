import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { PostViewDto } from '../view-dto/posts.view-dto';
import { IGetPostByIdDto } from './dto/get-post-by-id.dto';

export class GetPostByIdQuery {
  constructor(public queryParams: IGetPostByIdDto) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler implements IQueryHandler<
  GetPostByIdQuery,
  PostViewDto
> {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute({ queryParams }: GetPostByIdQuery): Promise<PostViewDto> {
    const result =
      await this.postsQueryRepository.getPostByIdOrThrow(queryParams);

    return PostViewDto.mapToView(result);
  }
}
