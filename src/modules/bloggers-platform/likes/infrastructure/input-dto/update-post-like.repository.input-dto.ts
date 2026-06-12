import { ELikeStatus } from '../../constants/like-status';

export interface IUpdatePostLikeRepositoryParams {
  userId: string;
  postId: string;
  likeStatus: ELikeStatus;
}
