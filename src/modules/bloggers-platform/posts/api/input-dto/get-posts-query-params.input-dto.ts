import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { EPostsSortBy } from './posts-sort-by';

export class GetPostsQueryParams extends BaseQueryParams {
  @IsEnum(EPostsSortBy)
  sortBy = EPostsSortBy.CREATED_AT;

  getSortOptions() {
    return {
      [this.sortBy]: this.sortDirection,
    };
  }
}
