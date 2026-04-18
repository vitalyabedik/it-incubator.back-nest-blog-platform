import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import { contentConstraints } from '../../domain/comment.constraints';

export class UpdateCommentInputDto {
  userId: string;

  @IsStringWithTrim({
    minLength: contentConstraints.minLength,
    maxLength: contentConstraints.maxLength,
  })
  content: string;
}
