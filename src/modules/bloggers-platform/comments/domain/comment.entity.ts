import { HydratedDocument, Model } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  CommentatorInfo,
  CommentatorInfoSchema,
} from './commentator-info.schema';
import {
  LikesCountInfo,
  LikesCountInfoSchema,
} from '../../likes/domain/likes-count-info.schema';

/**
 * Схема сущности Comment
 * Этот класс представляет схему и поведение сущности комментария.
 */
@Schema({ timestamps: true })
export class Comment {
  /**
   * ID поста, к которому относится комментарий
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  postId: string;

  /**
   * Содержание комментария
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  content: string;

  /**
   * Информация о комментаторе (вложенная схема)
   * @type {CommentatorInfo}
   * @required
   */
  @Prop({ type: CommentatorInfoSchema, required: true })
  commentatorInfo: CommentatorInfo;

  /**
   * Информация о лайках (количество лайков и дизлайков)
   * @type {LikesCountInfo}
   * @required
   */
  @Prop({ type: LikesCountInfoSchema, required: true })
  likesInfo: LikesCountInfo;

  /**
   * Время создания сущности
   * Явно определено, несмотря на опцию timestamps: true,
   * чтобы было корректно типизировано в TypeScript и
   * доступно в экземпляре класса и его методах.
   * @type {Date}
   */
  createdAt: Date;

  /**
   * Время удаления сущности (может быть null).
   * Если значение не null, значит запись была «мягко» удалена.
   * @type {Date | null}
   */
  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  /**
   * Виртуальное свойство для получения строкового ID
   * Возвращает строковое представление ObjectId документа.
   * @returns {string} Строковый ID документа
   */
  get id(): string {
    // @ts-ignore
    return this._id.toString();
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type TCommentDocument = HydratedDocument<Comment>;

export type TCommentModel = Model<TCommentDocument> & typeof Comment;

CommentSchema.loadClass(Comment);
