import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { TPostDocument } from '../../domain/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { FindPostByIdQuery } from '../queries/find-post-by-id.query-handler';

export class DeletePostCommand {
  constructor(public postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<
  DeletePostCommand,
  void
> {
  constructor(
    private postsRepository: PostsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ postId }: DeletePostCommand): Promise<void> {
    const post = await this.queryBus.execute<FindPostByIdQuery, TPostDocument>(
      new FindPostByIdQuery(postId),
    );

    post.softDelete();

    await this.postsRepository.save(post);
  }
}
