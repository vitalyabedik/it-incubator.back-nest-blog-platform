import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { TBlogDocument } from '../../domain/blog.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { FindBlogByIdQuery } from '../queries/find-blog-by-id.query-handler';

export class DeleteBlogCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<
  DeleteBlogCommand,
  void
> {
  constructor(
    private blogsRepository: BlogsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ blogId }: DeleteBlogCommand): Promise<void> {
    const blog = await this.queryBus.execute<FindBlogByIdQuery, TBlogDocument>(
      new FindBlogByIdQuery(blogId),
    );

    blog.softDelete();

    await this.blogsRepository.save(blog);
  }
}
