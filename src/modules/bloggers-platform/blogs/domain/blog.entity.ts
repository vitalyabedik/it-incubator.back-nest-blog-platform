import { HydratedDocument, Model } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { CreateBlogInputDto } from '../api/input-dto/blogs.create-input-dto';
import { UpdateBlogInputDto } from '../api/input-dto/blogs.update-input-dto';
import { errorMessages } from '../constants/texts';

/**
 * Схема сущности Blog
 * Этот класс представляет схему и поведение сущности блога.
 */
@Schema({ timestamps: true })
export class Blog {
  /**
   * Название блога
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  name: string;

  /**
   * Описание блога
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  description: string;

  /**
   * URL веб-сайта блога
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  websiteUrl: string;

  /**
   * Флаг членства (подписки) на блог
   * @type {boolean}
   * @required
   */
  @Prop({ type: Boolean, required: true })
  isMembership: boolean;

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
   * Фабричный метод для создания экземпляра Blog
   * Создаёт новый документ Post на основе DTO.
   * @param {CreatePostInputDto} dto - DTO для создания блога
   * @returns {TUserDocument} Созданный документ блога
   */
  static createInstance(dto: CreateBlogInputDto): TBlogDocument {
    const blog = new this();

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.isMembership = false;
    blog.deletedAt = null;

    return blog as TBlogDocument;
  }

  /**
   * Обновляет экземпляр Blog
   * @param {UpdateBlogInputDto} dto - DTO для обновления блога
   * @returns {this} Обновлённый экземпляр блога
   */
  updateInstance(dto: UpdateBlogInputDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;

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

export const BlogSchema = SchemaFactory.createForClass(Blog);

export type TBlogDocument = HydratedDocument<Blog>;

export type TBlogModel = Model<TBlogDocument> & typeof Blog;

BlogSchema.loadClass(Blog);
