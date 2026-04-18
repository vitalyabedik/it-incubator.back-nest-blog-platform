import { Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { DomainException } from '../exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../exceptions/domain-exception-codes';

const INCORRECT_OBJECT_ID_MESSAGE = 'Некорректный ObjectId';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(
    value: any,
    // metadata: ArgumentMetadata
  ): any {
    if (!isValidObjectId(value)) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: `${INCORRECT_OBJECT_ID_MESSAGE}: ${value}`,
        extensions: [{ field: 'uri param', message: 'Incorrect uri' }],
      });
    }

    return value;
  }
}
