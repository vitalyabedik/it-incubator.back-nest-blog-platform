import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { IGetCommentListQueryRepositoryParams } from './input-dto/get-comments-list.query-repository.input-dto';
import { ICommentsWithDetailsDto } from './input-dto/comment-with-details.dto';
import { IGetCommentByIdQueryRepositoryParams } from './input-dto/get-comment-by-id.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getCommentListByPostId(
    args: IGetCommentListQueryRepositoryParams,
  ): Promise<{ comments: ICommentsWithDetailsDto[]; totalCount: number }> {
    const { postId, userId, query } = args;
    const { sortBy, sortDirection, limit, offset } = query;

    const commentsPromise: Promise<ICommentsWithDetailsDto[]> =
      this.dataSource.query(
        `
          SELECT 
            c."id", 
            c."content",
            c."createdAt",
            u."id" as "userId",
            u."login" as "userLogin",
              (SELECT COUNT(*) FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."status" = 'Like')::int as "likesCount",
              (SELECT COUNT(*) FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."status" = 'Dislike')::int as "dislikesCount",
              COALESCE((SELECT status FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."userId" = $1 LIMIT 1), 'None') as "myStatus"
              FROM comments c
              LEFT JOIN users u ON c."ownerId" = u."id"
              WHERE c."deletedAt" IS NULL AND c."postId" = $2 
              ORDER BY ${`"${sortBy}"`} ${sortDirection}
              LIMIT $3
              OFFSET $4
        `,
        [userId || null, postId, limit, offset],
      );

    const totalCountPromise: Promise<[{ count: string }]> =
      this.dataSource.query(
        `
          SELECT COUNT(*)
            FROM comments c
            WHERE c."deletedAt" IS NULL AND c."postId" = $1 
          `,
        [postId],
      );

    const [comments, countResult] = await Promise.all([
      commentsPromise,
      totalCountPromise,
    ]);

    return {
      comments,
      totalCount: Number(countResult[0].count),
    };
  }

  async getCommentById(
    dto: IGetCommentByIdQueryRepositoryParams,
  ): Promise<ICommentsWithDetailsDto | null> {
    const { userId, commentId } = dto;

    const [comment]: ICommentsWithDetailsDto[] = await this.dataSource.query(
      `
          SELECT 
            c."id", 
            c."content",
            c."createdAt",
            u."id" as "userId",
            u."login" as "userLogin",
              (SELECT COUNT(*) FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."status" = 'Like')::int as "likesCount",
              (SELECT COUNT(*) FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."status" = 'Dislike')::int as "dislikesCount",
              COALESCE((SELECT status FROM comment_likes 
              WHERE comment_likes."commentId" =  c."id" AND comment_likes."userId" = $1 LIMIT 1), 'None') as "myStatus"
              FROM comments c
              LEFT JOIN users u ON c."ownerId" = u."id"
              WHERE c."deletedAt" IS NULL AND c."id" = $2 
        `,
      [userId || null, commentId],
    );
    if (!comment) return null;

    return comment;
  }

  async getCommentByIdOrThrow(
    dto: IGetCommentByIdQueryRepositoryParams,
  ): Promise<ICommentsWithDetailsDto> {
    const { commentId, userId } = dto;

    const comment = await this.getCommentById({ commentId, userId });

    if (!comment) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return comment;
  }
}
