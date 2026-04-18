import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { TCommentDocument } from '../../domain/comment.entity';
import { UpdateCommentLikeInputDto } from '../../api/input-dto/comment.update-like-input-dto';

export class UpdateCommentLikeCommand {
  constructor(public dto: UpdateCommentLikeInputDto) {}
}

@CommandHandler(UpdateCommentLikeCommand)
export class UpdateCommentLikeUseCase implements ICommandHandler<
  UpdateCommentLikeCommand,
  boolean
> {
  constructor(
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute({ dto }: UpdateCommentLikeCommand): Promise<boolean> {
    const { like, comment, likeStatus } = dto;

    const updatedComment =
      comment.updateCommentLikesByIncomingLikeStatusAndLike({
        like,
        likeStatus,
      }) as TCommentDocument;

    const updatedLike = like.updateLikeStatus(likeStatus);

    await this.likesRepository.save(updatedLike);
    await this.commentsRepository.save(updatedComment);

    return true;
  }
}
