import { HydratedDocument, Model } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { errorMessages } from '../constants/texts';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
} from './email-confirmation.schema';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from './password-recovery.schema';
import { EUserValidationField } from '../constants/errors';

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
   * Восстановление password (связь с подсхемой PasswordRecoverySchema)
   * @type {PasswordRecoverySchema}
   * @required
   */
  @Prop({ type: PasswordRecoverySchema, required: true })
  passwordRecovery: PasswordRecovery;

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
   * Фабричный метод для создания экземпляра User с подтвержденным email
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
    user.passwordRecovery = {
      code: null,
      expirationDate: null,
    };
    user.deletedAt = null;

    return user as TUserDocument;
  }

  /**
   * Фабричный метод для создания экземпляра User без подтвержденного email
   * Создаёт новый документ User на основе DTO.
   * @param {CreateUserDomainDto} dto - DTO для создания пользователя
   * @returns {TUserDocument} Созданный документ пользователя
   */
  static createUnconfirmedInstance(dto: CreateUserDomainDto): TUserDocument {
    const user = new this();

    const expirationDate = new Date();
    expirationDate.setHours(new Date().getHours() + 1);

    user.login = dto.login;
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.emailConfirmation = {
      isConfirmed: false,
      confirmationCode: randomUUID(),
      expirationDate,
    };
    user.passwordRecovery = {
      code: null,
      expirationDate: null,
    };
    user.deletedAt = null;

    return user as TUserDocument;
  }

  /**
   * Проверяет существование пользователя по login или email
   * Выполняет параллельный поиск в БД среди не удалённых пользователей
   * @param {Omit<CreateUserDomainDto, 'passwordHash'>} dto - DTO с login и email для проверки
   * @returns {Promise<{ isExist: boolean; field?: EUserValidationField }>}
   * Результат проверки: существует ли пользователь и по какому полю найден
   */
  static async checkIsUserExist(
    this: TUserModel,
    dto: Omit<CreateUserDomainDto, 'passwordHash'>,
  ) {
    const [userLoginDocument, userEmailDocument] = await Promise.all([
      this.findOne({ deletedAt: null, login: dto.login }).exec(),
      this.findOne({ deletedAt: null, email: dto.email }).exec(),
    ]);

    if (userLoginDocument) {
      return { isExist: true, field: EUserValidationField.LOGIN };
    }

    if (userEmailDocument) {
      return { isExist: true, field: EUserValidationField.EMAIL };
    }

    return { isExist: false };
  }

  /**
   * Устанавливает данные для восстановления пароля
   * Генерирует уникальный код восстановления и устанавливает срок его действия (1 час)
   * @returns {string} Сгенерированный код восстановления пароля
   */
  setPasswordRecoveryData() {
    const code = randomUUID();
    const expirationDate = new Date();

    expirationDate.setHours(expirationDate.getHours() + 1);

    this.passwordRecovery.code = code;
    this.passwordRecovery.expirationDate = expirationDate;

    return code;
  }

  /**
   * Проверяет валидность кода восстановления пароля
   * @param {string} recoveryCode - Код восстановления для проверки
   * @returns {boolean} true - если код валидный и не просрочен, false - в противном случае
   */
  validatePasswordRecoveryCode(recoveryCode: string) {
    const { code, expirationDate } = this.passwordRecovery;

    if (
      !code ||
      code !== recoveryCode ||
      !expirationDate ||
      expirationDate < new Date()
    )
      return false;

    return true;
  }

  /**
   * Проверяет валидность кода подтверждения регистрации
   * @param {string} code - Код подтверждения для проверки
   * @returns {boolean} true - если код валидный, email не подтверждён и код не просрочен,
   * false - в противном случае
   */
  validateRegistrationConfirmationCode(code: string) {
    const { isConfirmed, confirmationCode, expirationDate } =
      this.emailConfirmation;

    if (
      isConfirmed ||
      !confirmationCode ||
      confirmationCode !== code ||
      !expirationDate ||
      expirationDate < new Date()
    )
      return false;

    return true;
  }

  /**
   * Подтверждает регистрацию пользователя
   * Устанавливает статус подтверждения email в true и очищает данные о коде подтверждения
   * @returns {User} Текущий экземпляр пользователя для chain-вызовов
   */
  confirmRegistration() {
    this.emailConfirmation.isConfirmed = true;
    this.emailConfirmation.confirmationCode = null;
    this.emailConfirmation.expirationDate = null;

    return this;
  }

  /**
   * Обновляет пароль пользователя
   * Устанавливает новый хеш пароля и очищает данные восстановления пароля
   * @param {string} newPasswordHash - Новый хеш пароля
   * @returns {User} Текущий экземпляр пользователя для chain-вызовов
   */
  updatePassword(newPasswordHash: string) {
    this.passwordHash = newPasswordHash;
    this.passwordRecovery.code = null;
    this.passwordRecovery.expirationDate = null;

    return this;
  }

  /**
   * Обновляет код подтверждения регистрации
   * Генерирует новый UUID для подтверждения email
   * @returns {string} Новый сгенерированный код подтверждения
   */
  updateRegistrationConfirmationCode() {
    const confirmationCode = randomUUID();
    const expirationDate = new Date();

    expirationDate.setHours(expirationDate.getHours() + 1);

    this.emailConfirmation.confirmationCode = confirmationCode;
    this.emailConfirmation.expirationDate = expirationDate;

    return this;
  }

  /**
   * Помечает пользователя как удалённого (soft delete)
   * Генерирует ошибку, если запись уже помечена как удалённая.
   * @throws {Error} Если сущность уже удалена
   */
  softDelete(): void {
    if (this.deletedAt !== null) {
      throw new Error(errorMessages.notFound);
    }

    this.deletedAt = new Date();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export type TUserDocument = HydratedDocument<User>;

export type TUserModel = Model<TUserDocument> & typeof User;

UserSchema.loadClass(User);
