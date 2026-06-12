import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsOptionalString } from '../../../../../core/decorators/validation/is-optional-string';
import { EBlogsSortBy } from './blogs-sort-by';

export class GetBlogsQueryParams extends BaseQueryParams {
  @IsEnum(EBlogsSortBy)
  sortBy = EBlogsSortBy.CREATED_AT;

  @IsOptionalString()
  searchNameTerm: string | null = null;
}
