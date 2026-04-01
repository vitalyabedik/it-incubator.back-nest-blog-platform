import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ELikeStatus } from '../constants/like-status';

/**
 * Схема сущности Like
 * Представляет информацию о лайке/дизлайке пользователя к посту или комментарию
 */
@Schema({ timestamps: true, versionKey: false })
export class Like {
  /**
   * ID автора лайка (пользователя, который поставил лайк)
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  authorId: string;

  /**
   * Логин автора лайка
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  login: string;

  /**
   * ID родительской сущности (поста или комментария)
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  parentId: string;

  /**
   * Время создания сущности
   * Явно определено, несмотря на опцию timestamps: true,
   * чтобы было корректно типизировано в TypeScript и
   * доступно в экземпляре класса и его методах.
   * @type {Date}
   */
  createdAt: Date;

  /**
   * Статус лайка (Like, Dislike, None)
   * @type {ELikeStatus}
   * @required
   * @default ELikeStatus.None
   */
  @Prop({
    type: String,
    required: true,
    enum: ELikeStatus,
    default: ELikeStatus.None,
  })
  status: ELikeStatus;

  /**
   * Дата добавления лайка (если статус Like)
   * Используется для сортировки последних лайков
   * @type {Date | null}
   * @default null
   */
  @Prop({ type: Date, nullable: true, default: null })
  addedLikeDate: Date | null;

  @Prop({ type: Date, nullable: true })
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

export const LikeSchema = SchemaFactory.createForClass(Like);

export type TLikeDocument = HydratedDocument<Like>;

export type TLikeModel = Model<TLikeDocument> & typeof Like;

LikeSchema.loadClass(Like);
