import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/query/blogs.query-repository';
import { PostsFactory } from '../factories/posts.factory';
import { PostViewDto } from '../view-dto/posts.view-dto';
import { ICreatePostDto } from './dto/create-post.dto';

export class CreatePostCommand {
  constructor(public dto: ICreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<
  CreatePostCommand,
  PostViewDto
> {
  constructor(
    private postsFactory: PostsFactory,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute({ dto }: CreatePostCommand): Promise<PostViewDto> {
    await this.blogsQueryRepository.getBlogByIdOrThrow(dto.blogId);

    return this.postsFactory.createPost(dto);
  }
}
