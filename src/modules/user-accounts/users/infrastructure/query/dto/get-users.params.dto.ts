import { ESortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { EUsersSortBy } from '../../../api/input-dto/users-sort-by';

export interface IGetUsersParamsDto {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: EUsersSortBy;
  sortDirection: ESortDirection;
  limit: number;
  offset: number;
}
