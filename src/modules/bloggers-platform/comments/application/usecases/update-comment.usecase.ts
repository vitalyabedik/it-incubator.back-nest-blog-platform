import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { UpdateCommentInputDto } from '../../api/input-dto/comment.update-input-dto';
import { errorMessages } from '../../constants/texts';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public dto: UpdateCommentInputDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<
  UpdateCommentCommand,
  boolean
> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ commentId, dto }: UpdateCommentCommand): Promise<boolean> {
    const { content, userId } = dto;

    const comment =
      await this.commentsRepository.findCommentByIdOrThrow(commentId);

    if (!comment.isCommentOwner(userId)) {
      throw new DomainException({
        code: EDomainExceptionCode.Forbidden,
        message: errorMessages.noAccess,
      });
    }

    const updatedComment = comment.updateInstance(content);

    await this.commentsRepository.save(updatedComment);

    return true;
  }
}
