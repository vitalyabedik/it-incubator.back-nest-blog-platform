import { IsEnum } from 'class-validator';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { IPostEntityDto } from '../../domain/dto/post.entity.dto';

export class CreatePostLikeInputDto {
  post: IPostEntityDto;
  userId: string;
  login: string;

  @IsEnum(ELikeStatus)
  likeStatus: ELikeStatus;
}
