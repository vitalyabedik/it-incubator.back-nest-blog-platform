import { ELikeStatus } from '../../../../likes/constants/like-status';
import { IPostEntityDto } from '../../../domain/dto/post.entity.dto';

export interface IPostWithDetails extends Omit<IPostEntityDto, 'deletedAt'> {
  blogName: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: ELikeStatus;
}
