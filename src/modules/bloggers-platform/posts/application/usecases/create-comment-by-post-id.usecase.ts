import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CommentsFactory } from '../../../comments/application/factories/comments.factory';
import { CommentViewDto } from '../../../comments/application/view-dto/comments.view-dto';
import { errorMessages } from '../../constants/texts';
import { ICreateCommentByPostIdDto } from './dto/create-comment-by-post-id.dto';

export class CreateCommentByPostIdCommand {
  constructor(public dto: ICreateCommentByPostIdDto) {}
}

@CommandHandler(CreateCommentByPostIdCommand)
export class CreateCommentByPostIdUseCase implements ICommandHandler<
  CreateCommentByPostIdCommand,
  CommentViewDto
> {
  constructor(
    private postsRepository: PostsRepository,
    private commentsFactory: CommentsFactory,
  ) {}

  async execute({
    dto,
  }: CreateCommentByPostIdCommand): Promise<CommentViewDto> {
    const post = await this.postsRepository.findPostById(dto.postId);

    if (!post) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return this.commentsFactory.createComment(dto);
  }
}
