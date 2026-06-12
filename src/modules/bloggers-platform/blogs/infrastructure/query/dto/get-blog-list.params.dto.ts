import { ESortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { EBlogsSortBy } from '../../../api/input-dto/blogs-sort-by';

export interface IGetBlogListParamsDto {
  searchNameTerm: string | null;
  sortBy: EBlogsSortBy;
  sortDirection: ESortDirection;
  limit: number;
  offset: number;
}
