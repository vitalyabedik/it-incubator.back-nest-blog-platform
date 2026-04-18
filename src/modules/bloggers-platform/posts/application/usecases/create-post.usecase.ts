import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { FindBlogByIdQuery } from '../../../blogs/application/queries/find-blog-by-id.query-handler';
import { TBlogDocument } from '../../../blogs/domain/blog.entity';

import { CreatePostInputDto } from '../../api/input-dto/posts.create-input-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostsFactory } from '../factories/posts.factory';

export class CreatePostCommand {
  constructor(public dto: CreatePostInputDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<
  CreatePostCommand,
  string
> {
  constructor(
    private readonly queryBus: QueryBus,
    private postsRepository: PostsRepository,
    private postsFactory: PostsFactory,
  ) {}

  async execute({ dto }: CreatePostCommand): Promise<string> {
    const blog = await this.queryBus.execute<FindBlogByIdQuery, TBlogDocument>(
      new FindBlogByIdQuery(dto.blogId),
    );

    const createdPost = await this.postsFactory.createPost(blog.name, dto);

    await this.postsRepository.save(createdPost);

    return createdPost._id.toString();
  }
}
