import { ELikeStatus } from '../../constants/like-status';

export class CreateLikeDomainDto {
  authorId: string;
  login: string;
  parentId: string;
  status: ELikeStatus;
}
