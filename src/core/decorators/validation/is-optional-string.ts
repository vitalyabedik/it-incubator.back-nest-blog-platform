import { applyDecorators } from '@nestjs/common';
import { IsString, IsOptional } from 'class-validator';

export const IsOptionalString = () => applyDecorators(IsString(), IsOptional());
