import { ELikeStatus } from '../../../../likes/constants/like-status';
import { ICommentEntityDto } from '../../../domain/input-dto/comment.entity.dto';

export interface ICommentsWithDetailsDto extends Omit<
  ICommentEntityDto,
  'ownerId' | 'postId' | 'deletedAt'
> {
  userId: string;
  userLogin: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: ELikeStatus;
}
