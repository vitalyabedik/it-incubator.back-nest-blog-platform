import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { TPostDocument } from '../../domain/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class FindPostByIdQuery {
  constructor(public id: string) {}
}

@QueryHandler(FindPostByIdQuery)
export class FindPostByIdQueryHandler implements IQueryHandler<
  FindPostByIdQuery,
  TPostDocument
> {
  constructor(
    @Inject(PostsRepository)
    private postsRepository: PostsRepository,
  ) {}

  async execute({ id }: FindPostByIdQuery): Promise<TPostDocument> {
    return this.postsRepository.findPostById(id);
  }
}
