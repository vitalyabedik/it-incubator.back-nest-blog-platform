import { GetPostsQueryParams } from '../../../api/input-dto/get-posts-query-params.input-dto';

export class GetPostsListByBlogIdQueryRepositoryParams {
  blogId: string;
  userId?: string;
  query: GetPostsQueryParams;
}
