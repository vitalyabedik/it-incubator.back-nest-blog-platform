import { HydratedDocument, Model } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
} from './email-confirmation.schema';

/**
 * Схема сущности User
 * Этот класс представляет схему и поведение сущности пользователя.
 */
@Schema({ timestamps: true })
export class User {
  /**
   * Логин пользователя (должен быть уникальным)
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true, unique: true })
  login: string;

  /**
   * Email пользователя
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true, unique: true })
  email: string;

  /**
   * Хеш пароля для аутентификации
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  passwordHash: string;

  /**
   * Подтверждение email (связь с подсхемой EmailConfirmation)
   * @type {EmailConfirmation}
   * @required
   */
  @Prop({ type: EmailConfirmationSchema, required: true })
  emailConfirmation: EmailConfirmation;

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
   * Фабричный метод для создания экземпляра User
   * Создаёт новый документ User на основе DTO.
   * @param {CreateUserDomainDto} dto - DTO для создания пользователя
   * @returns {TUserDocument} Созданный документ пользователя
   */
  static createInstance(dto: CreateUserDomainDto): TUserDocument {
    const user = new this();

    user.login = dto.login;
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.emailConfirmation = {
      isConfirmed: true,
      confirmationCode: null,
      expirationDate: null,
    };
    user.deletedAt = null;

    return user as TUserDocument;
  }

  /**
   * Помечает пользователя как удалённого (soft delete)
   * Генерирует ошибку, если запись уже помечена как удалённая.
   * @throws {Error} Если сущность уже удалена
   */
  softDelete(): void {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }

    this.deletedAt = new Date();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export type TUserDocument = HydratedDocument<User>;

export type TUserModel = Model<TUserDocument> & typeof User;

UserSchema.loadClass(User);
