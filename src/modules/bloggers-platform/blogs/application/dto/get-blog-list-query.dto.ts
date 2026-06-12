import { BaseQueryParamsDto } from '../../../../../core/dto/base.query-params.dto';
import { EBlogsSortBy } from '../../api/input-dto/blogs-sort-by';

export interface IGetBlogListQueryDto extends BaseQueryParamsDto {
  searchNameTerm: string | null;
  sortBy: EBlogsSortBy;
}
