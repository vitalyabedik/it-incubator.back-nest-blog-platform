import { GetPostsQueryParams } from '../../../api/input-dto/get-posts-query-params.input-dto';

export class GetPostsListQueryRepositoryParams {
  userId?: string;
  query: GetPostsQueryParams;
}
