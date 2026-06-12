import { UserFromRequestDataInputDto } from '../../../../user-accounts/users/api/input-dto/user-from-request-data-input.dto';

export interface IUpdateCommentContentDto extends UserFromRequestDataInputDto {
  id: string;
  content: string;
}
