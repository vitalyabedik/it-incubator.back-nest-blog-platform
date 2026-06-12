import { UserFromRequestDataInputDto } from '../../../../user-accounts/users/api/input-dto/user-from-request-data-input.dto';

export interface IDeleteCommentDto extends UserFromRequestDataInputDto {
  id: string;
}
