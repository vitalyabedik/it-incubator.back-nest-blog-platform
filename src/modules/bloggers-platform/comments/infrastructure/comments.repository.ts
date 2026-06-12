import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ICommentEntityDto } from '../domain/input-dto/comment.entity.dto';
import { IUpdateCommentParamsDto } from './input-dto/update-comment.params.dto';
import { ICreateCommentParamsDto } from './input-dto/create-comment.params.dto';
import { IDeleteCommentParamsDto } from './input-dto/delete-comment.params.dto';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findCommentById(commentId: string): Promise<ICommentEntityDto> {
    const [comment]: ICommentEntityDto[] = await this.dataSource.query(
      `  SELECT c.* 
            FROM comments c
            WHERE c."id" = $1 AND c."deletedAt" IS NULL 
        `,
      [commentId],
    );

    return comment;
  }

  async createComment(
    dto: ICreateCommentParamsDto,
  ): Promise<ICommentEntityDto> {
    const { userId, postId, content } = dto;

    const [comment]: ICommentEntityDto[] = await this.dataSource.query(
      `
          INSERT INTO "comments" ("ownerId", "postId", "content")
            VALUES ($1, $2, $3)
            RETURNING *
        `,
      [userId, postId, content],
    );

    return comment;
  }

  async updateComment(dto: IUpdateCommentParamsDto): Promise<boolean> {
    const { userId, commentId, content } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
          UPDATE "comments"
            SET "content" = $3
            WHERE  "ownerId" = $1 AND "id" = $2 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [userId, commentId, content],
    );

    return rows.length > 0;
  }

  async softDelete(dto: IDeleteCommentParamsDto): Promise<boolean> {
    const { userId, commentId } = dto;

    const [rows]: [{ id: string }[], number] = await this.dataSource.query(
      `
          UPDATE "comments"
            SET "deletedAt" = NOW()
            WHERE  "ownerId" = $1 AND "id" = $2 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [userId, commentId],
    );

    return rows.length > 0;
  }
}
