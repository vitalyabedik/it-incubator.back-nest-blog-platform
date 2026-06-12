import { ESortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { EPostsSortBy } from '../../../api/input-dto/posts-sort-by';

export interface IGetPostListParamsDto {
  blogId: string;
  userId: string | undefined;
  query: {
    sortBy: EPostsSortBy;
    sortDirection: ESortDirection;
    limit: number;
    offset: number;
  };
}
