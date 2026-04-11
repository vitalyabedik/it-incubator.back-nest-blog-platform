import { QueryFilter } from 'mongoose';
import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { IsOptionalString } from '../../../../core/decorators/validation/is-optional-string';
import { TUserDocument } from '../../domain/user.entity';
import { EUsersSortBy } from './users-sort-by';

export class GetUsersQueryParams extends BaseQueryParams {
  @IsEnum(EUsersSortBy)
  sortBy = EUsersSortBy.CREATED_AT;

  @IsOptionalString()
  searchLoginTerm: string | null = null;

  @IsOptionalString()
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
