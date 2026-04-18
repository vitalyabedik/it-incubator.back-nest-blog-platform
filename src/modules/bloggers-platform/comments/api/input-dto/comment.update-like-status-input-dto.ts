import { IsEnum } from 'class-validator';
import { ELikeStatus } from '../../../likes/constants/like-status';

export class UpdateCommentLikeStatusInputDto {
  userId: string;
  login: string;

  @IsEnum(ELikeStatus)
  likeStatus: ELikeStatus;
}
