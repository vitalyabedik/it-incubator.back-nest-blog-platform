import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserFromRequestDataInputDto } from '../../../../user-accounts/api/input-dto/user-from-request-data-input.dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';
import { CommentViewDto } from '../view-dto/comments.view-dto';

export class GetCommentByIdQuery {
  constructor(
    public commentId: string,
    public userDto: UserFromRequestDataInputDto | null,
  ) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler implements IQueryHandler<
  GetCommentByIdQuery,
  CommentViewDto
> {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute({
    commentId,
    userDto,
  }: GetCommentByIdQuery): Promise<CommentViewDto> {
    return this.commentsQueryRepository.getCommentById({
      commentId,
      userId: userDto?.userId,
    });
  }
}
