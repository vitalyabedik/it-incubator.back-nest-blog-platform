import { IsEnum } from 'class-validator';
import { TLikeDocument } from '../../../likes/domain/like.entity';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { Comment } from '../../domain/comment.entity';

export class UpdateCommentLikeInputDto {
  like: TLikeDocument;
  comment: Comment;

  @IsEnum(ELikeStatus)
  likeStatus: ELikeStatus;
}
