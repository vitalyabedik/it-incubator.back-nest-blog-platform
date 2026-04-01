import { QueryFilter } from 'mongoose';
import { TUserDocument } from '../../domain/user.entity';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { EUsersSortBy } from './users-sort-by';

export class GetUsersQueryParams extends BaseQueryParams {
  sortBy = EUsersSortBy.CREATED_AT;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;

  getFilter(): QueryFilter<TUserDocument> {
    const filter: QueryFilter<TUserDocument> = {
      deletedAt: null,
    };

    if (this.searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: this.searchLoginTerm, $options: 'i' },
      });
    }

    if (this.searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        email: { $regex: this.searchEmailTerm, $options: 'i' },
      });
    }

    return filter;
  }

  getSortOptions() {
    return {
      [this.sortBy]: this.sortDirection,
    };
  }
}
