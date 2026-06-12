import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { IUpdateCommentContentDto } from '../dto/update-comment-content.dto';
import { errorMessages } from '../../constants/texts';

export class UpdateCommentContentCommand {
  constructor(public dto: IUpdateCommentContentDto) {}
}

@CommandHandler(UpdateCommentContentCommand)
export class UpdateCommentContentUseCase implements ICommandHandler<
  UpdateCommentContentCommand,
  boolean
> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ dto }: UpdateCommentContentCommand): Promise<boolean> {
    const { id, content, userId } = dto;

    const isUpdated = await this.commentsRepository.updateComment({
      commentId: id,
      content,
      userId,
    });
    if (isUpdated) return true;

    const comment = await this.commentsRepository.findCommentById(id);

    if (!comment) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    throw new DomainException({
      code: EDomainExceptionCode.Forbidden,
      message: errorMessages.noAccess,
    });
  }
}
