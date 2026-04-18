import { IsEnum } from 'class-validator';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { Comment } from '../../domain/comment.entity';

export class CreateCommentLikeInputDto {
  comment: Comment;
  userId: string;
  login: string;

  @IsEnum(ELikeStatus)
  likeStatus: ELikeStatus;
}
