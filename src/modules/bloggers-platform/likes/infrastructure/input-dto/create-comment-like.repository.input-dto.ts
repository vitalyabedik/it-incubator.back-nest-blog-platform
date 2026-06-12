import { ELikeStatus } from '../../constants/like-status';

export interface ICreateCommentLikeRepositoryParams {
  userId: string;
  commentId: string;
  likeStatus: ELikeStatus;
}
