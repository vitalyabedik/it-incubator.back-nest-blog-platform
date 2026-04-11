import { applyDecorators } from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export const IsNumberFromQuery = () =>
  applyDecorators(
    Type(() => Number),
    IsNumber(),
  );
