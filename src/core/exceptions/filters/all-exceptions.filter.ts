import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CoreConfig } from '../../../core/config/core.config';
import { EDomainExceptionCode } from '../domain-exception-codes';
import { TErrorResponseBody } from './error-response-body.type';

const DEFAULT_EXCEPTION_MESSAGE = 'Неизвестный exception';
const SOME_ERROR_MESSAGE = 'Произошла ошибка';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  constructor(@Inject() private readonly coreConfig: CoreConfig) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = exception.message || DEFAULT_EXCEPTION_MESSAGE;
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = this.buildResponseBody(request.url, message);

    response.status(status).json(responseBody);
  }

  private buildResponseBody(
    requestUrl: string,
    message: string,
  ): TErrorResponseBody {
    const isProduction = this.coreConfig.env === 'production';

    if (isProduction) {
      return {
        timestamp: new Date().toISOString(),
        path: null,
        message: SOME_ERROR_MESSAGE,
        extensions: [],
        code: EDomainExceptionCode.InternalServerError,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message,
      extensions: [],
      code: EDomainExceptionCode.InternalServerError,
    };
  }
}
