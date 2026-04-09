import { IsEnum } from 'class-validator';
import { IsNumberFromQuery } from '../decorators/validation/is-number-from-query';

export enum ESortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export class BaseQueryParams {
  @IsNumberFromQuery()
  pageNumber: number = 1;

  @IsNumberFromQuery()
  pageSize: number = 10;

  @IsEnum(ESortDirection)
  sortDirection: ESortDirection = ESortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
