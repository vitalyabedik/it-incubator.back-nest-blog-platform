import { ELikeStatus } from '../../constants/like-status';

export interface IUpdateCommentLikeRepositoryParams {
  userId: string;
  commentId: string;
  likeStatus: ELikeStatus;
}
