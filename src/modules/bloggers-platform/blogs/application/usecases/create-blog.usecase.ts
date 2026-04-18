import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogInputDto } from '../../api/input-dto/blogs.create-input-dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsFactory } from '../factories/blogs.factory';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogInputDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<
  CreateBlogCommand,
  string
> {
  constructor(
    private blogsFactory: BlogsFactory,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreateBlogCommand): Promise<string> {
    const createdBlog = await this.blogsFactory.createBlog(dto);

    await this.blogsRepository.save(createdBlog);

    return createdBlog._id.toString();
  }
}
