import { IGetCommentListByPostIdQueryDto } from '../../../../comments/application/dto/get-comment-list-by-postId-query.dto';

export interface IGetCommentListByPostIdDto {
  postId: string;
  userId?: string;
  query: IGetCommentListByPostIdQueryDto;
}
