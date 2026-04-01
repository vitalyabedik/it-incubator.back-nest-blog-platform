import { InjectModel } from '@nestjs/mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { TCommentModel, Comment } from '../../domain/comment.entity';
import { CommentViewDto } from '../../api/view-dto/comments.view-dto';
import { GetCommentsListQueryRepositoryParams } from './input-dto/get-comments-list.query-repository.input-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: TCommentModel,
    @Inject() private likesRepository: LikesRepository,
  ) {}

  async getCommentListByPostId({
    postId,
    userId,
    query,
  }: GetCommentsListQueryRepositoryParams): Promise<
    PaginatedViewDto<CommentViewDto[]>
  > {
    const filter = { postId, deletedAt: null };

    const [comments, totalCount] = await Promise.all([
      this.CommentModel.find(filter)
        .sort(query.getSortOptions())
        .skip(query.calculateSkip())
        .limit(query.pageSize)
        .lean()
        .exec(),
      this.CommentModel.countDocuments(filter).exec(),
    ]);

    const likesMap: Map<string, ELikeStatus> = new Map<string, ELikeStatus>();

    if (userId && comments.length > 0) {
      const commentsIds = comments.map((c) => c._id.toString());

      const userLikes = await this.likesRepository.getLikeListForUser({
        parentIds: commentsIds,
        authorId: userId,
      });

      userLikes.forEach((like) => likesMap.set(like.parentId, like.status));
    }

    const items = comments.map((comment) => {
      const myStatus = userId
        ? likesMap.get(comment._id.toString()) || ELikeStatus.None
        : ELikeStatus.None;

      return CommentViewDto.mapToView(comment, myStatus);
    });

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
