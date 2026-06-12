import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';
import { CommentViewDto } from '../view-dto/comments.view-dto';
import { IGetCommentByIdDto } from './dto/get-comment-by-id.dto';

export class GetCommentByIdQuery {
  constructor(public dto: IGetCommentByIdDto) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler implements IQueryHandler<
  GetCommentByIdQuery,
  CommentViewDto
> {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute({ dto }: GetCommentByIdQuery): Promise<CommentViewDto> {
    const comment =
      await this.commentsQueryRepository.getCommentByIdOrThrow(dto);

    return CommentViewDto.mapToView(comment);
  }
}
