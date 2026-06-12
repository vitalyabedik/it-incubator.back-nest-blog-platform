import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { EPostsSortBy } from '../api/input-dto/posts-sort-by';

export interface IGetPostListQueryDto extends BaseQueryParams {
  sortBy: EPostsSortBy;
}
