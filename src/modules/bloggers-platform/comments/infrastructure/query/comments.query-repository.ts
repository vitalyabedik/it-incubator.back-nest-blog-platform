import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { Like, TLikeModel } from '../../../likes/domain/like.entity';

import { TCommentModel, Comment } from '../../domain/comment.entity';
import { CommentViewDto } from '../../application/view-dto/comments.view-dto';
import { errorMessages } from '../../constants/texts';
import { GetCommentsListQueryRepositoryParams } from './input-dto/get-comments-list.query-repository.input-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: TCommentModel,
    @InjectModel(Like.name)
    private LikeModel: TLikeModel,
    private likesRepository: LikesRepository,
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

      const userLikes = await this.likesRepository.findLikeListForUser({
        parentIds: commentsIds,
        authorId: userId,
      });

      userLikes.forEach((like) => likesMap.set(like.parentId, like.status));
    }

    const items = comments.map((comment) => {
      const myStatus = userId
        ? likesMap.get(comment._id.toString()) || ELikeStatus.None
        : ELikeStatus.None;

      return CommentViewDto.mapToView({ comment, myStatus });
    });

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getCommentById({
    commentId,
    userId,
  }: {
    commentId: string;
    userId?: string;
  }): Promise<CommentViewDto> {
    const comment = await this.CommentModel.findOne({
      _id: commentId,
      deletedAt: null,
    }).exec();

    if (!comment) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    const parentId = comment._id.toString();
    const like = userId
      ? await this.LikeModel.findOne({
          parentId,
          authorId: userId,
          status: { $ne: ELikeStatus.None },
          deletedAt: null,
        })
          .select('status')
          .lean()
          .exec()
      : null;

    return CommentViewDto.mapToView({
      comment,
      myStatus: like?.status || ELikeStatus.None,
    });
  }
}
