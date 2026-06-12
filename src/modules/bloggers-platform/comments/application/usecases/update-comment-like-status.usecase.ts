import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { IUpdateCommentLikeStatusDto } from '../dto/update-comment-like-status.dto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';

export class UpdateCommentLikeStatusCommand {
  constructor(public dto: IUpdateCommentLikeStatusDto) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase implements ICommandHandler<
  UpdateCommentLikeStatusCommand,
  boolean
> {
  constructor(
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute({ dto }: UpdateCommentLikeStatusCommand): Promise<boolean> {
    const { id, likeStatus, userId } = dto;

    const comment = await this.commentsRepository.findCommentById(id);

    if (!comment) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    await this.likesRepository.updateCommentLike({
      userId,
      commentId: comment.id,
      likeStatus,
    });

    return true;
  }
}
