import { UserFromRequestDataInputDto } from '../../../../user-accounts/users/api/input-dto/user-from-request-data-input.dto';
import { ELikeStatus } from '../../../likes/constants/like-status';

export interface IUpdateCommentLikeStatusDto extends UserFromRequestDataInputDto {
  id: string;
  likeStatus: ELikeStatus;
}
