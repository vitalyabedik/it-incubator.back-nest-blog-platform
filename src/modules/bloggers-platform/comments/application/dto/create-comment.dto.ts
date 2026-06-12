import { UserFromRequestDataInputDto } from '../../../../user-accounts/users/api/input-dto/user-from-request-data-input.dto';

export interface ICreateCommentDto extends UserFromRequestDataInputDto {
  postId: string;
  content: string;
}
