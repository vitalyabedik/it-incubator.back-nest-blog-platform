import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  ICommentLikeEntityDto,
  IPostLikeEntityDto,
} from '../domain/dto/like-entity.dto';
import { IFindPostLikeRepositoryParams } from './input-dto/find-post-like.repository.input-dto';
import { ICreatePostLikeRepositoryParams } from './input-dto/create-post-like.repository.input-dto';
import { IUpdatePostLikeRepositoryParams } from './input-dto/update-post-like.repository.input-dto';
import { IFindCommentLikeRepositoryParams } from './input-dto/find-comment-like.repository.input-dto';
import { ICreateCommentLikeRepositoryParams } from './input-dto/create-comment-like.repository.input-dto';
import { IUpdateCommentLikeRepositoryParams } from './input-dto/update-comment-like.repository.input-dto';

@Injectable()
export class LikesRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findPostLike(
    dto: IFindPostLikeRepositoryParams,
  ): Promise<IPostLikeEntityDto> {
    const { userId, postId } = dto;

    const [like]: IPostLikeEntityDto[] = await this.dataSource.query(
      `
          SELECT *
            FROM "post_likes" 
            WHERE "userId" = $1 AND "postId" = $2
         `,
      [userId, postId],
    );

    return like;
  }

  async createPostLike(
    dto: ICreatePostLikeRepositoryParams,
  ): Promise<IPostLikeEntityDto> {
    const { userId, postId, likeStatus } = dto;

    const [like]: IPostLikeEntityDto[] = await this.dataSource.query(
      `
           INSERT INTO "post_likes" 
            ("userId", "postId", "status")
             VALUES ($1, $2, $3)
             RETURNING *
         `,
      [userId, postId, likeStatus],
    );

    return like;
  }

  async updatePostLike(
    dto: IUpdatePostLikeRepositoryParams,
  ): Promise<ICommentLikeEntityDto> {
    const { userId, postId, likeStatus } = dto;

    const [like]: IPostLikeEntityDto[] = await this.dataSource.query(
      `
           INSERT INTO "post_likes" 
            ("userId", "postId", "status")
            VALUES ($1, $2, $3)
            ON CONFLICT ("userId", "postId")
            DO UPDATE SET status = EXCLUDED.status 
            RETURNING *
         `,
      [userId, postId, likeStatus],
    );

    return like;
  }

  async findCommentLike(
    dto: IFindCommentLikeRepositoryParams,
  ): Promise<ICommentLikeEntityDto> {
    const { userId, commentId } = dto;

    const [like]: ICommentLikeEntityDto[] = await this.dataSource.query(
      `
          SELECT *
            FROM "comment_likes" 
            WHERE "userId" = $1 AND "commentId" = $2
         `,
      [userId, commentId],
    );

    return like;
  }

  async createCommentLike(
    dto: ICreateCommentLikeRepositoryParams,
  ): Promise<ICommentLikeEntityDto> {
    const { userId, commentId, likeStatus } = dto;

    const [like]: ICommentLikeEntityDto[] = await this.dataSource.query(
      `
           INSERT INTO "comment_likes" 
              ("userId", "commentId", "status")
              VALUES ($1, $2, $3)
              RETURNING *
         `,
      [userId, commentId, likeStatus],
    );

    return like;
  }

  async updateCommentLike(
    dto: IUpdateCommentLikeRepositoryParams,
  ): Promise<ICommentLikeEntityDto> {
    const { userId, commentId, likeStatus } = dto;

    const [like]: ICommentLikeEntityDto[] = await this.dataSource.query(
      `
           INSERT INTO "comment_likes" 
            ("userId", "commentId", "status")
            VALUES ($1, $2, $3)
            ON CONFLICT ("userId", "commentId")
            DO UPDATE SET status = EXCLUDED.status 
            RETURNING *
         `,
      [userId, commentId, likeStatus],
    );

    return like;
  }
}
