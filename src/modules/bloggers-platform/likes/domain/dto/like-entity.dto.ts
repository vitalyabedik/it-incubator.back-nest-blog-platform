import { ELikeStatus } from '../../constants/like-status';

export interface IPostLikeEntityDto {
  userId: string;
  postId: string;
  likeStatus: ELikeStatus;
}

export interface ICommentLikeEntityDto {
  userId: string;
  postId: string;
  likeStatus: ELikeStatus;
}
