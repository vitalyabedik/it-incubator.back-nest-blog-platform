import { HydratedDocument, Model } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  LikesCountInfo,
  LikesCountInfoSchema,
} from '../../likes/domain/likes-count-info.schema';
import { TLikeDocument } from '../../likes/domain/like.entity';
import { ELikeStatus } from '../../likes/constants/like-status';
import { CreatePostInputDto } from '../api/input-dto/posts.create-input-dto';
import { UpdatePostInputDto } from '../api/input-dto/posts.update-input-dto';
import { errorMessages } from '../constants/texts';

/**
 * Схема сущности Post
 * Этот класс представляет схему и поведение сущности поста.
 */
@Schema({ timestamps: true })
export class Post {
  /**
   * Заголовок поста
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  title: string;

  /**
   * Краткое описание поста
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  shortDescription: string;

  /**
   * Содержание поста
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  content: string;

  /**
   * ID блога, к которому относится пост
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  blogId: string;

  /**
   * Название блога (денормализованное поле для быстрого доступа)
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  blogName: string;

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
   * Фабричный метод для создания экземпляра Post
   * Создаёт новый документ Post на основе DTO.
   * @param {CreatePostInputDto} dto - DTO для создания поста
   * @returns {TUserDocument} Созданный документ поста
   */
  static createInstance(
    blogName: string,
    dto: CreatePostInputDto,
  ): TPostDocument {
    const post = new this();

    post.blogId = dto.blogId;
    post.blogName = blogName;
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.likesInfo = { likesCount: 0, dislikesCount: 0 };
    post.deletedAt = null;

    return post as TPostDocument;
  }

  /**
   * Обновляет экземпляр Post
   * @param {UpdatePostInputDto} dto - DTO для обновления поста
   * @returns {this} Обновлённый экземпляр поста
   */
  updateInstance(dto: UpdatePostInputDto) {
    this.blogId = dto.blogId;
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;

    return this;
  }

  /**
   * Обновляет информацию о лайках поста на основе нового статуса и лайка
   * @param {ELikeStatus} likeStatus - Новый статус лайка
   * @returns {Post} Текущий экземпляр поста для chain-вызовов
   */
  updatePostLikesByIncomingLikeStatusAndLike(args: {
    like: TLikeDocument;
    likeStatus: ELikeStatus;
  }) {
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
   * Обновляет информацию о лайках поста только на основе нового статуса
   * @param {ELikeStatus} likeStatus - Новый статус лайка
   * @returns {Post} Текущий экземпляр поста для chain-вызовов
   */
  updatePostLikesByIncomingLikeStatus(likeStatus: ELikeStatus) {
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

export const PostSchema = SchemaFactory.createForClass(Post);

export type TPostDocument = HydratedDocument<Post>;

export type TPostModel = Model<TPostDocument> & typeof Post;

PostSchema.loadClass(Post);
