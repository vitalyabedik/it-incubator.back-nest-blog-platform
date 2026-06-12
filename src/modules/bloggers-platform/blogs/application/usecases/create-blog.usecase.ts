import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsFactory } from '../factories/blogs.factory';
import { BlogViewDto } from '../view-dto/blogs.view-dto';
import { ICreateBlogDto } from '../dto/create-blog.dto';

export class CreateBlogCommand {
  constructor(public dto: ICreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<
  CreateBlogCommand,
  BlogViewDto
> {
  constructor(private blogsFactory: BlogsFactory) {}

  async execute({ dto }: CreateBlogCommand): Promise<BlogViewDto> {
    return this.blogsFactory.createBlog(dto);
  }
}
