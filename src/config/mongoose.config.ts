import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { AppConfigService } from './config.types';

enum EDBLogAction {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

const DB_LOGGER_NAME = 'DB';
const DB_SUCCESS_CONNECTION = 'Соединение с базой данных успешно установлено';
const DB_SUCCESS_DISCONNECTION = 'Соединение с базой данных отключено';
const DB_ERROR_CONNECTION = 'Соединение с базой данных произошло с ошибкой';

export const getMongooseConfig = (
  configService: AppConfigService,
): MongooseModuleFactoryOptions => {
  return {
    uri: configService.getOrThrow('MONGO_DB_URL'),
    retryAttempts: 5,
    retryDelay: 3000,

    onConnectionCreate: (connection) => {
      connection.on(EDBLogAction.CONNECTED, () => {
        Logger.log(DB_SUCCESS_CONNECTION, DB_LOGGER_NAME);
      });

      connection.on(EDBLogAction.ERROR, (error) => {
        Logger.error(
          `${DB_ERROR_CONNECTION}: ${error.message}`,
          error.stack,
          DB_LOGGER_NAME,
        );
      });

      connection.on(EDBLogAction.DISCONNECTED, () => {
        Logger.warn(DB_SUCCESS_DISCONNECTION, DB_LOGGER_NAME);
      });
    },
  };
};
