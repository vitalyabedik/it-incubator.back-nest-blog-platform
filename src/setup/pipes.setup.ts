import {
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { EDomainExceptionCode } from '../core/exceptions/domain-exception-codes';
import {
  DomainException,
  Extension,
} from '../core/exceptions/domain-exceptions';

const VALIDATION_ERROR_MESSAGE = 'Произошла ошибка при валидации';

export const errorFormatter = (errors: ValidationError[]): Extension[] => {
  const errorsForResponse: Extension[] = [];

  errors.forEach((error) => {
    if (!error.constraints && error.children?.length) {
      errorFormatter(error.children).forEach((childError) =>
        errorsForResponse.push(childError),
      );
      return;
    }

    if (error.constraints) {
      const constraints = error.constraints;

      Object.keys(constraints).forEach((key) => {
        errorsForResponse.push({
          message: constraints[key]
            ? `${constraints[key]}; полученное значение: ${error?.value}`
            : '',
          field: error.property,
        });
      });
    }
  });

  return errorsForResponse;
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errorFormatter(errors);

        throw new DomainException({
          code: EDomainExceptionCode.ValidationError,
          message: VALIDATION_ERROR_MESSAGE,
          extensions: formattedErrors,
        });
      },
    }),
  );
}
