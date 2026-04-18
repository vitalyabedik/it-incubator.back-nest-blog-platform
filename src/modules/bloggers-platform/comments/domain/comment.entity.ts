import { HydratedDocument, Model } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  LikesCountInfo,
  LikesCountInfoSchema,
} from '../../likes/domain/likes-count-info.schema';
import { ELikeStatus } from '../../likes/constants/like-status';
import { TLikeDocument } from '../../likes/domain/like.entity';
import { errorMessages } from '../constants/texts';
import {
  CommentatorInfo,
  CommentatorInfoSchema,
} from './commentator-info.schema';
import { CreateCommentDomainDto } from './input-dto/create-comment.domain.dto';

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

  /**
   * Фабричный метод для создания экземпляра Comment
   * Создаёт новый документ Comment на основе DTO.
   * @param {CreateCommentDomainDto} dto - DTO для создания комментария
   * @returns {TCommentDocument} Созданный документ комментария
   */
  static createInstance(dto: CreateCommentDomainDto): TCommentDocument {
    const { postId, commentatorInfo, commentDto } = dto;

    const comment = new this();

    comment.postId = postId;
    comment.content = commentDto.content;
    comment.commentatorInfo = {
      userId: commentatorInfo.userId,
      userLogin: commentatorInfo.userLogin,
    };
    comment.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
    };
    comment.deletedAt = null;

    return comment as TCommentDocument;
  }

  /**
   * Обновляет содержание комментария
   * @param {string} newContent - Новое содержание комментария
   * @returns {Comment} Текущий экземпляр комментария для chain-вызовов
   */
  updateInstance(newContent: string): this {
    this.content = newContent;

    return this;
  }

  /**
   * Проверяет, является ли пользователь владельцем комментария
   * @param {string} userId - ID пользователя для проверки
   * @returns {boolean} true - если пользователь является владельцем, false - в противном случае
   */
  isCommentOwner(userId: string): boolean {
    return this.commentatorInfo.userId === userId;
  }

  /**
   * Обновляет информацию о лайках комментария на основе существующего лайка и нового статуса
   * @param {object} args - Аргументы для обновления лайков
   * @param {TLikeDocument} args.like - Существующий лайк
   * @param {ELikeStatus} args.likeStatus - Новый статус лайка
   * @returns {Comment} Текущий экземпляр комментария для chain-вызовов
   */
  updateCommentLikesByIncomingLikeStatusAndLike(args: {
    like: TLikeDocument;
    likeStatus: ELikeStatus;
  }): this {
    const { like, likeStatus } = args;
    const oldStatus = like.status;
    const newStatus = likeStatus;

    if (oldStatus === ELikeStatus.Like) {
      this.likesInfo.likesCount -= 1;
    } else if (oldStatus === ELikeStatus.Dislike) {
      this.likesInfo.dislikesCount -= 1;
    }

    if (newStatus === ELikeStatus.Like) {
      this.likesInfo.likesCount += 1;
    } else if (newStatus === ELikeStatus.Dislike) {
      this.likesInfo.dislikesCount += 1;
    }

    this.likesInfo.likesCount = Math.max(0, this.likesInfo.likesCount);
    this.likesInfo.dislikesCount = Math.max(0, this.likesInfo.dislikesCount);

    like.status = newStatus;

    return this;
  }

  /**
   * Обновляет информацию о лайках комментария только на основе нового статуса
   * @param {ELikeStatus} likeStatus - Новый статус лайка
   * @returns {Comment} Текущий экземпляр комментария для chain-вызовов
   */
  updateCommentLikesByIncomingLikeStatus(likeStatus: ELikeStatus) {
    if (likeStatus === ELikeStatus.Like) {
      this.likesInfo.likesCount += 1;
    }

    if (likeStatus === ELikeStatus.Dislike) {
      this.likesInfo.dislikesCount += 1;
    }

    return this;
  }

  /**
   * Помечает пользователя как удалённого (soft delete)
   * Генерирует ошибку, если запись уже помечена как удалённая.
   * @throws {Error} Если сущность уже удалена
   */
  softDelete(): void {
    if (this.deletedAt !== null) {
      throw new Error(errorMessages.alreadyDeleted);
    }

    this.deletedAt = new Date();
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type TCommentDocument = HydratedDocument<Comment>;

export type TCommentModel = Model<TCommentDocument> & typeof Comment;

CommentSchema.loadClass(Comment);
