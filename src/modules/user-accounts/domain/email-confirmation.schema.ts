import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Схема EmailConfirmation
 * Описывает состояние подтверждения email пользователя.
 */
@Schema({ _id: false, versionKey: false })
export class EmailConfirmation {
  /**
   * Флаг подтверждения email
   * Показывает, был ли email пользователя подтверждён.
   * @type {boolean}
   * @required
   */
  @Prop({ type: Boolean, required: true })
  isConfirmed: boolean;

  /**
   * Код подтверждения email
   * Используется при отправке ссылки/кода для подтверждения.
   * Может отсутствовать (null).
   * @type {string | null}
   */
  @Prop({ type: String, default: null })
  confirmationCode: string | null;

  /**
   * Срок действия кода подтверждения
   * Определяет, до какого момента код считается валидным.
   * Может быть null, если код не установлен.
   * @type {Date | null}
   */
  @Prop({ type: Date, default: null })
  expirationDate: Date | null;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);
