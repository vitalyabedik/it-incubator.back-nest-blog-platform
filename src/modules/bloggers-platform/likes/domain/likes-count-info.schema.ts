import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Схема для хранения агрегированной информации о количестве лайков и дизлайков
 */
@Schema({ _id: false, versionKey: false })
export class LikesCountInfo {
  /**
   * Общее количество лайков
   * @type {number}
   * @required
   */
  @Prop({ type: Number, required: true })
  likesCount: number;

  /**
   * Общее количество дизлайков
   * @type {number}
   * @required
   */
  @Prop({ type: Number, required: true })
  dislikesCount: number;
}

export const LikesCountInfoSchema =
  SchemaFactory.createForClass(LikesCountInfo);
