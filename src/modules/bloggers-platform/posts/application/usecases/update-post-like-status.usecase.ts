import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { UpdatePostLikeStatusInputDto } from '../../api/input-dto/posts.update-like-status-input-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CreatePostLikeCommand } from './create-post-like.usecase';
import { UpdatePostLikeCommand } from './update-post-like.usecase';

export class UpdatePostLikeStatusCommand {
  constructor(
    public postId: string,
    public dto: UpdatePostLikeStatusInputDto,
  ) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase implements ICommandHandler<
  UpdatePostLikeStatusCommand,
  boolean
> {
  constructor(
    private commandBus: CommandBus,
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute({
    postId,
    dto,
  }: UpdatePostLikeStatusCommand): Promise<boolean> {
    const { userId, login, likeStatus } = dto;

    const post = await this.postsRepository.findPostById(postId);

    const parentId = post._id.toString();

    const existingLike = await this.likesRepository.findLikeByFilter({
      parentId,
      authorId: userId,
    });

    if (!existingLike) {
      return this.commandBus.execute(
        new CreatePostLikeCommand({
          post,
          userId,
          login,
          likeStatus,
        }),
      );
    }

    if (likeStatus === existingLike.status) return true;

    return this.commandBus.execute(
      new UpdatePostLikeCommand({
        like: existingLike,
        post,
        likeStatus,
      }),
    );
  }
}
