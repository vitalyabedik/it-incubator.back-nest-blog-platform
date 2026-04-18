import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { LikesFactory } from '../../../likes/factories/likes.factory';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CreateCommentLikeInputDto } from '../../api/input-dto/comment.create-like-input-dto';
import { TCommentDocument } from '../../domain/comment.entity';

export class CreateCommentLikeCommand {
  constructor(public dto: CreateCommentLikeInputDto) {}
}

@CommandHandler(CreateCommentLikeCommand)
export class CreateCommentLikeUseCase implements ICommandHandler<
  CreateCommentLikeCommand,
  boolean
> {
  constructor(
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository,
    private likesFactory: LikesFactory,
  ) {}

  async execute({ dto }: CreateCommentLikeCommand): Promise<boolean> {
    const { comment, userId, login, likeStatus } = dto;

    if (likeStatus === ELikeStatus.None) return true;

    const createdLike = await this.likesFactory.createLike({
      authorId: userId,
      login,
      parentId: comment.id,
      status: likeStatus,
    });

    const updatedComment = comment.updateCommentLikesByIncomingLikeStatus(
      likeStatus,
    ) as TCommentDocument;

    await this.likesRepository.save(createdLike);
    await this.commentsRepository.save(updatedComment);

    return true;
  }
}
