import { IsEnum } from 'class-validator';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { TPostDocument } from '../../domain/post.entity';

export class CreatePostLikeInputDto {
  post: TPostDocument;
  userId: string;
  login: string;

  @IsEnum(ELikeStatus)
  likeStatus: ELikeStatus;
}
