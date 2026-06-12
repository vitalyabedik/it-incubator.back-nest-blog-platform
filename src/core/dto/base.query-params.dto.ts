import { ESortDirection } from './base.query-params.input-dto';

export class BaseQueryParamsDto {
  pageNumber: number;
  pageSize: number;
  sortDirection: ESortDirection;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
