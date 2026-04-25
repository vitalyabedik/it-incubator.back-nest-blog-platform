import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { UserFromRequestDataInputDto } from '../../../../user-accounts/api/input-dto/user/user-from-request-data-input.dto';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { errorMessages } from '../../constants/texts';

export class DeleteCommentCommand {
  constructor(
    public commentId: string,
    public dto: UserFromRequestDataInputDto,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<
  DeleteCommentCommand,
  void
> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ commentId, dto }: DeleteCommentCommand): Promise<void> {
    const { userId } = dto;

    const comment =
      await this.commentsRepository.findCommentByIdOrThrow(commentId);

    if (!comment.isCommentOwner(userId)) {
      throw new DomainException({
        code: EDomainExceptionCode.Forbidden,
        message: errorMessages.noAccess,
      });
    }

    comment.softDelete();

    await this.commentsRepository.save(comment);
  }
}
