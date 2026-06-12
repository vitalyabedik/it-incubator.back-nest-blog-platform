import { IsEnum } from 'class-validator';
import { TLikeDocument } from '../../../likes/domain/like.entity';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { IPostEntityDto } from '../../domain/dto/post.entity.dto';

export class UpdatePostLikeInputDto {
  post: IPostEntityDto;
  like: TLikeDocument;

  @IsEnum(ELikeStatus)
  likeStatus: ELikeStatus;
}
