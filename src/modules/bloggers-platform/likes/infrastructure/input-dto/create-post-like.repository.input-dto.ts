import { ELikeStatus } from '../../constants/like-status';

export interface ICreatePostLikeRepositoryParams {
  userId: string;
  postId: string;
  likeStatus: ELikeStatus;
}
