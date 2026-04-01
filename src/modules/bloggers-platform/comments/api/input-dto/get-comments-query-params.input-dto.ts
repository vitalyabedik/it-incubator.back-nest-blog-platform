import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { ECommentsSortBy } from './comments-sort-by';

export class GetCommentsQueryParams extends BaseQueryParams {
  sortBy = ECommentsSortBy.CREATED_AT;

  getSortOptions() {
    return {
      [this.sortBy]: this.sortDirection,
    };
  }
}
