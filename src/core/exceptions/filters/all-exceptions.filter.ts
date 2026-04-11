import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TErrorResponseBody } from './error-response-body.type';
import { EDomainExceptionCode } from '../domain-exception-codes';

const DEFAULT_EXCEPTION_MESSAGE = 'Неизвестный exception';
const SOME_ERROR_MESSAGE = 'Произошла ошибка';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
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
    const isProduction = process.env.NODE_ENV === 'production';

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
