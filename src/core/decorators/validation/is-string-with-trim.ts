import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';
import { Trim } from '../transform/trim';

type TArgs = {
  minLength?: number;
  maxLength: number;
};

export const IsStringWithTrim = ({ minLength = 1, maxLength }: TArgs) =>
  applyDecorators(IsString(), Length(minLength, maxLength), Trim());
