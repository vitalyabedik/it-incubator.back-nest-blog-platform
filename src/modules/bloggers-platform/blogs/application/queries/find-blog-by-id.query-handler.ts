import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { TBlogDocument } from '../../domain/blog.entity';

export class FindBlogByIdQuery {
  constructor(public blogId: string) {}
}

@QueryHandler(FindBlogByIdQuery)
export class FindBlogByIdQueryHandler implements IQueryHandler<
  FindBlogByIdQuery,
  TBlogDocument
> {
  constructor(
    @Inject(BlogsRepository)
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ blogId }: FindBlogByIdQuery): Promise<TBlogDocument> {
    return this.blogsRepository.findBlogById(blogId);
  }
}
