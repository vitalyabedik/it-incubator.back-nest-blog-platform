/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, PipeTransform } from '@nestjs/common';
import { isUUID, IsUUIDVersion } from 'class-validator';
import { EDomainExceptionCode } from '../exceptions/domain-exception-codes';
import { DomainException } from '../exceptions/domain-exceptions';

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  private version?: IsUUIDVersion;

  static version(version: IsUUIDVersion): UUIDValidationPipe {
    const pipe = new UUIDValidationPipe();

    pipe['version'] = version;

    return pipe;
  }

  transform(value: any) {
    const isValid = this.version ? isUUID(value, this.version) : isUUID(value);

    if (!isValid) {
      throw new DomainException({
        code: EDomainExceptionCode.BadRequest,
        message: `Invalid uuid: ${value}`,
        extensions: [{ field: 'uri param', message: 'Incorrect uri' }],
      });
    }

    return value;
  }
}
