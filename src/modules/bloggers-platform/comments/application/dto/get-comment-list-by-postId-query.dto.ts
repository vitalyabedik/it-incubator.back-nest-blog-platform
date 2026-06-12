import { BaseQueryParamsDto } from '../../../../../core/dto/base.query-params.dto';

import { ECommentsSortBy } from '../../api/input-dto/comments-sort-by';

export interface IGetCommentListByPostIdQueryDto extends BaseQueryParamsDto {
  sortBy: ECommentsSortBy;
}
