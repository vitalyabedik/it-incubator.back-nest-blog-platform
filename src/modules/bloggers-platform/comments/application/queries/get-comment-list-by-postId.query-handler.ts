import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { GetCommentsListQueryRepositoryParams } from '../../infrastructure/query/input-dto/get-comments-list.query-repository.input-dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';
import { CommentViewDto } from '../view-dto/comments.view-dto';

export class GetCommentListByPostIdQuery {
  constructor(public queryParams: GetCommentsListQueryRepositoryParams) {}
}

@QueryHandler(GetCommentListByPostIdQuery)
export class GetCommentListByPostIdQueryHandler implements IQueryHandler<
  GetCommentListByPostIdQuery,
  PaginatedViewDto<CommentViewDto[]>
> {
  constructor(
    @Inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(
    query: GetCommentListByPostIdQuery,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    await this.postsRepository.findPostById(query.queryParams.postId);

    return this.commentsQueryRepository.getCommentListByPostId(
      query.queryParams,
    );
  }
}
