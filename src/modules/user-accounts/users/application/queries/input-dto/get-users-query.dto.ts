import { ESortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { EUsersSortBy } from '../../../api/input-dto/users-sort-by';

export interface IGetUsersQueryDto {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: EUsersSortBy;
  pageNumber: number;
  pageSize: number;
  sortDirection: ESortDirection;
}
