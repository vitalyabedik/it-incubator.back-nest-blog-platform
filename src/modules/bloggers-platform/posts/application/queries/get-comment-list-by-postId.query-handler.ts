import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { errorMessages } from '../../constants/texts';
import { CommentsQueryRepository } from '../../../comments/infrastructure/query/comments.query-repository';
import { IGetCommentListQueryRepositoryParams } from '../../../comments/infrastructure/query/input-dto/get-comments-list.query-repository.input-dto';
import { CommentViewDto } from '../../../comments/application/view-dto/comments.view-dto';
import { IGetCommentListByPostIdDto } from './dto/get-comment-list-by-postId.dto';

export class GetCommentListByPostIdQuery {
  constructor(public dto: IGetCommentListByPostIdDto) {}
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

  async execute({
    dto,
  }: GetCommentListByPostIdQuery): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const { postId, query, userId } = dto;

    const post = await this.postsRepository.findPostById(postId);

    if (!post) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    const params: IGetCommentListQueryRepositoryParams = {
      postId,
      userId,
      query: {
        limit: query.pageSize,
        offset: query.calculateSkip(),
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
      },
    };

    const commentsData =
      await this.commentsQueryRepository.getCommentListByPostId(params);

    const items = commentsData.comments.map((item) =>
      CommentViewDto.mapToView(item),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount: commentsData.totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
