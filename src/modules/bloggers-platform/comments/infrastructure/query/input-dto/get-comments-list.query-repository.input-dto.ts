import { ESortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { ECommentsSortBy } from '../../../api/input-dto/comments-sort-by';

export interface IGetCommentListQueryRepositoryParams {
  postId: string;
  userId: string | undefined;
  query: {
    sortBy: ECommentsSortBy;
    sortDirection: ESortDirection;
    limit: number;
    offset: number;
  };
}
