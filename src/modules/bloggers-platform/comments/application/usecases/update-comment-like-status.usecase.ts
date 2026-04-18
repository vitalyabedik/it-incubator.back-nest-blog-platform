import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { UpdateCommentLikeStatusInputDto } from '../../api/input-dto/comment.update-like-status-input-dto';
import { CreateCommentLikeCommand } from './create-comment-like.usecase';
import { UpdateCommentLikeCommand } from './update-comment-like.usecase';

export class UpdateCommentLikeStatusCommand {
  constructor(
    public commentId: string,
    public dto: UpdateCommentLikeStatusInputDto,
  ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase implements ICommandHandler<
  UpdateCommentLikeStatusCommand,
  boolean
> {
  constructor(
    private commandBus: CommandBus,
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute({
    commentId,
    dto,
  }: UpdateCommentLikeStatusCommand): Promise<boolean> {
    const { login, userId, likeStatus } = dto;

    const comment =
      await this.commentsRepository.findCommentByIdOrThrow(commentId);

    const parentId = comment._id.toString();

    const existingLike = await this.likesRepository.findLikeByFilter({
      parentId,
      authorId: userId,
    });
    if (!existingLike) {
      return this.commandBus.execute(
        new CreateCommentLikeCommand({
          comment,
          userId,
          login,
          likeStatus,
        }),
      );
    }

    if (likeStatus === existingLike.status) return true;

    return this.commandBus.execute(
      new UpdateCommentLikeCommand({
        like: existingLike,
        comment,
        likeStatus,
      }),
    );
  }
}
