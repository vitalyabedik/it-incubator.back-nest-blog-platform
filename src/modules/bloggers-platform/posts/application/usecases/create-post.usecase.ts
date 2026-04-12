import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';

import { FindBlogByIdQuery } from '../../../blogs/application/queries/find-blog-by-id.query-handler';
import { TBlogDocument } from '../../../blogs/domain/blog.entity';

import { CreatePostInputDto } from '../../api/input-dto/posts.create-input-dto';
import { Post, TPostModel } from '../../domain/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(public dto: CreatePostInputDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<
  CreatePostCommand,
  string
> {
  constructor(
    @InjectModel(Post.name)
    private PostModel: TPostModel,
    private postsRepository: PostsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ dto }: CreatePostCommand): Promise<string> {
    const blog = await this.queryBus.execute<FindBlogByIdQuery, TBlogDocument>(
      new FindBlogByIdQuery(dto.blogId),
    );

    const post = this.PostModel.createInstance(blog.name, dto);

    await this.postsRepository.save(post);

    return post._id.toString();
  }
}
