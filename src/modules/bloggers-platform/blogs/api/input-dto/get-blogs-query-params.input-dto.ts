import { QueryFilter } from 'mongoose';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { TBlogDocument } from '../../domain/blog.entity';
import { EBlogsSortBy } from './blogs-sort-by';

export class GetBlogsQueryParams extends BaseQueryParams {
  sortBy = EBlogsSortBy.CREATED_AT;
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
