import { BaseQueryParamsDto } from '../../../../../core/dto/base.query-params.dto';
import { EUsersSortBy } from '../../api/input-dto/users-sort-by';

export interface IGetUserListQueryDto extends BaseQueryParamsDto {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: EUsersSortBy;
}
