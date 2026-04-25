import { HydratedDocument, Model } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SecurityDeviceCreateInputDto } from '../api/input-dto/security-device/security-device.create-input-dto';
import { SecurityDeviceUpdateInputDto } from '../api/input-dto/security-device/security-device.update-input-dto';

/**
 * Схема сущности SecurityDevice
 * Этот класс представляет схему и поведение сущности сессии устройства пользователя.
 */
@Schema({ timestamps: true })
export class SecurityDevice {
  /**
   * ID пользователя
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  userId: string;

  /**
   * ID устройства
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  deviceId: string;

  /**
   * Время выдачи токена (Issued At)
   * @type {Number}
   * @required
   */
  @Prop({ type: Number, required: true })
  iat: number;

  /**
   * Название устройства
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  deviceName: string;

  /**
   * IP адрес устройства
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  ip: string;

  /**
   * Время истечения сессии
   * @type {Number}
   * @required
   */
  @Prop({ type: Number, required: true })
  expirationAt: number;

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
   * Фабричный метод для создания экземпляра SecurityDevice
   * Создаёт новый документ сессии устройства на основе DTO.
   * @param {SecurityDeviceCreateInputDto} dto - DTO для создания сессии
   * @returns {Promise<TSecurityDeviceDocument>} Созданный документ сессии
   */
  static createInstance(
    deviceDto: SecurityDeviceCreateInputDto,
  ): TSecurityDeviceDocument {
    const securityDevice = new this();

    securityDevice.userId = deviceDto.userId;
    securityDevice.deviceId = deviceDto.deviceId;
    securityDevice.deviceName = deviceDto.deviceName;
    securityDevice.ip = deviceDto.ip;
    securityDevice.iat = deviceDto.iat;
    securityDevice.expirationAt = deviceDto.expirationAt;

    return securityDevice as TSecurityDeviceDocument;
  }

  /**
   * Обновляет данные сессии устройства
   * @param {SecurityDeviceUpdateInputDto} dto - DTO с новыми данными для обновления
   * @returns {SecurityDevice} Текущий экземпляр сессии для chain-вызовов
   */
  updateInstance(dto: SecurityDeviceUpdateInputDto) {
    this.ip = dto.ip;
    this.iat = dto.iat;
    this.expirationAt = dto.expirationAt;

    return this;
  }

  /**
   * Проверяет, является ли сессия чужой для указанного пользователя
   * @param {string} userId - ID пользователя для проверки
   * @returns {boolean} true - если сессия принадлежит другому пользователю, false - если своя
   */
  checkIsForeignSession(userId: string): boolean {
    return this.userId !== userId;
  }
}

export const SecurityDeviceSchema =
  SchemaFactory.createForClass(SecurityDevice);

export type TSecurityDeviceDocument = HydratedDocument<SecurityDevice>;

export type TSecurityDeviceModel = Model<TSecurityDeviceDocument> &
  typeof SecurityDevice;

SecurityDeviceSchema.loadClass(SecurityDevice);
