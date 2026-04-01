import { GetCommentsQueryParams } from '../../../api/input-dto/get-comments-query-params.input-dto';

export class GetCommentsListQueryRepositoryParams {
  postId: string;
  userId?: string;
  query: GetCommentsQueryParams;
}
