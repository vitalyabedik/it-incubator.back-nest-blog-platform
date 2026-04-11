import { QueryFilter } from 'mongoose';
import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsOptionalString } from '../../../../../core/decorators/validation/is-optional-string';
import { TBlogDocument } from '../../domain/blog.entity';
import { EBlogsSortBy } from './blogs-sort-by';

export class GetBlogsQueryParams extends BaseQueryParams {
  @IsEnum(EBlogsSortBy)
  sortBy = EBlogsSortBy.CREATED_AT;

  @IsOptionalString()
  searchNameTerm: string | null = null;

  getFilter(): QueryFilter<TBlogDocument> {
    const filter: QueryFilter<TBlogDocument> = {
      deletedAt: null,
    };

    if (this.searchNameTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: this.searchNameTerm, $options: 'i' },
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
