import { IGetPostListQueryDto } from '../../../dto/get-post-list-query.dto';

export interface IPostListByBlogIdDto {
  blogId: string;
  query: IGetPostListQueryDto;
  userId?: string;
}
