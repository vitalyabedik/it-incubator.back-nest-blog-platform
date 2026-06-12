import { ELikeStatus } from '../../../../likes/constants/like-status';

export interface IUpdatePostLikeStatusDto {
  postId: string;
  userId: string;
  likeStatus: ELikeStatus;
}
