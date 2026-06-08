import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsOptionalString } from '../../../../../core/decorators/validation/is-optional-string';
import { EUsersSortBy } from './users-sort-by';

export class GetUsersQueryParamsDto extends BaseQueryParams {
  @IsEnum(EUsersSortBy)
  sortBy = EUsersSortBy.CREATED_AT;

  @IsOptionalString()
  searchLoginTerm: string | null = null;

  @IsOptionalString()
  searchEmailTerm: string | null = null;

  getSortOptions() {
    return {
      [this.sortBy]: this.sortDirection,
    };
  }
}
