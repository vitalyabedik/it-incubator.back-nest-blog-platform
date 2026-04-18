import { IsEnum } from 'class-validator';
import { TLikeDocument } from '../../../likes/domain/like.entity';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { TPostDocument } from '../../domain/post.entity';

export class UpdatePostLikeInputDto {
  post: TPostDocument;
  like: TLikeDocument;

  @IsEnum(ELikeStatus)
  likeStatus: ELikeStatus;
}
