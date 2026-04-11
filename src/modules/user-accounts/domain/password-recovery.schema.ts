import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Схема PasswordRecovery
 * Описывает состояние восстановления password пользователя.
 */
@Schema({ _id: false, versionKey: false })
export class PasswordRecovery {
  /**
   * Код восстановления password
   * Используется при отправке ссылки/кода для подтверждения.
   * Может отсутствовать (null).
   * @type {string | null}
   */
  @Prop({ type: String, nullable: true })
  code: string | null;

  /**
   * Срок действия кода подтверждения
   * Определяет, до какого момента код считается валидным.
   * Может быть null, если код не установлен.
   * @type {Date | null}
   */
  @Prop({ type: Date, nullable: true })
  expirationDate: Date | null;
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
