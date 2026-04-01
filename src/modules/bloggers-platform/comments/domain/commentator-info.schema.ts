import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Схема сущности CommentatorInfo
 * Этот класс представляет информацию о комментаторе (пользователе, оставившем комментарий).
 * Является вложенной схемой (sub-schema) для сущности Comment.
 */
@Schema({ _id: false, versionKey: false })
export class CommentatorInfo {
  /**
   * ID пользователя-комментатора
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  userId: string;

  /**
   * Логин пользователя-комментатора
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  userLogin: string;
}

export const CommentatorInfoSchema =
  SchemaFactory.createForClass(CommentatorInfo);
