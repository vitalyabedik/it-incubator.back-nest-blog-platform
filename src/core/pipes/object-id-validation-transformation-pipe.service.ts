import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId, Types } from 'mongoose';
import { DomainException } from '../exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../exceptions/domain-exception-codes';

const INCORRECT_OBJECT_ID_MESSAGE = 'Некорректный ObjectId';

@Injectable()
export class ObjectIdValidationTransformationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): any {
    if (metadata.metatype !== Types.ObjectId) return value;

    if (!isValidObjectId(value)) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: `${INCORRECT_OBJECT_ID_MESSAGE}: ${value}`,
      });
    }

    return new Types.ObjectId(value);
  }
}

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
      });
    }

    return value;
  }
}
