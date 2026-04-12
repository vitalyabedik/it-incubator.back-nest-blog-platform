import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, TBlogDocument } from '../../domain/blog.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { FindBlogByIdQuery } from '../queries/find-blog-by-id.query-handler';
import { UpdateBlogInputDto } from '../../api/input-dto/blogs.update-input-dto';

export class UpdateBlogCommand {
  constructor(
    public blogId: string,
    public dto: UpdateBlogInputDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<
  UpdateBlogCommand,
  void
> {
  constructor(
    @InjectModel(Blog.name)
    private blogsRepository: BlogsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ blogId, dto }: UpdateBlogCommand): Promise<void> {
    const blog = await this.queryBus.execute<FindBlogByIdQuery, TBlogDocument>(
      new FindBlogByIdQuery(blogId),
    );

    const updatedBlog = blog.updateInstance(dto);

    await this.blogsRepository.save(updatedBlog);
  }
}
