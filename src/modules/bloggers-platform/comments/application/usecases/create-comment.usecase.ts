import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GetPostByIdQuery } from '../../../posts/application/queries/get-post-by-id.query-handler';
import { GetUserByIdQuery } from '../../../../user-accounts/application/queries/get-user-by-id.query-handler';
import { CreateCommentInputDto } from '../../api/input-dto/comment.create-input-dto';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentatorInfo } from '../view-dto/comments.view-dto';
import { CommentsFactory } from '../factories/comments.factory';

export class CreateCommentCommand {
  constructor(
    public postId: string,
    public commentatorInfo: CommentatorInfo,
    public dto: CreateCommentInputDto,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<
  CreateCommentCommand,
  string
> {
  constructor(
    private queryBus: QueryBus,
    private commentsRepository: CommentsRepository,
    private commentsFactory: CommentsFactory,
  ) {}

  async execute(args: CreateCommentCommand): Promise<string> {
    const { postId, commentatorInfo, dto } = args;

    await this.queryBus.execute(new GetPostByIdQuery({ postId }));
    await this.queryBus.execute(new GetUserByIdQuery(commentatorInfo.userId));

    const createdComment = await this.commentsFactory.createComment({
      commentDto: dto,
      commentatorInfo,
      postId,
    });

    await this.commentsRepository.save(createdComment);

    return createdComment._id.toString();
  }
}
