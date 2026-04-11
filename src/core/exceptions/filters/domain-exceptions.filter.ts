import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException, Extension } from '../domain-exceptions';
import { EDomainExceptionCode } from '../domain-exception-codes';
import { TErrorResponseBody } from './error-response-body.type';

@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.mapToHttpStatus(exception.code);
    const responseBody = this.buildResponseBody(exception, request.url);

    response.status(status).json(responseBody);
  }

  private mapToHttpStatus(code: EDomainExceptionCode): number {
    switch (code) {
      case EDomainExceptionCode.BadRequest:
      case EDomainExceptionCode.ValidationError:
      case EDomainExceptionCode.ConfirmationCodeExpired:
      case EDomainExceptionCode.EmailNotConfirmed:
      case EDomainExceptionCode.PasswordRecoveryCodeExpired:
        return HttpStatus.BAD_REQUEST;
      case EDomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;
      case EDomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;
      case EDomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      case EDomainExceptionCode.TooManyRequests:
        return HttpStatus.TOO_MANY_REQUESTS;
      case EDomainExceptionCode.InternalServerError:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.I_AM_A_TEAPOT;
    }
  }

  private buildResponseBody(
    exception: DomainException,
    requestUrl: string,
  ): TErrorResponseBody | { errorsMessages: Extension[] } {
    const isTest = process.env.NODE_ENV === 'test';

    if (isTest) {
      return {
        errorsMessages: exception.extensions,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message: exception.message,
      code: exception.code,
      extensions: exception.extensions,
    };
  }
}
