import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePostInputDto } from '../../api/input-dto/posts.update-input-dto';
import { Post, TPostDocument } from '../../domain/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { FindPostByIdQuery } from '../queries/find-post-by-id.query-handler';

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public dto: UpdatePostInputDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<
  UpdatePostCommand,
  void
> {
  constructor(
    @InjectModel(Post.name)
    private postsRepository: PostsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ postId, dto }: UpdatePostCommand): Promise<void> {
    const post = await this.queryBus.execute<FindPostByIdQuery, TPostDocument>(
      new FindPostByIdQuery(postId),
    );

    const updatedPost = post.updateInstance(dto);

    await this.postsRepository.save(updatedPost);
  }
}
