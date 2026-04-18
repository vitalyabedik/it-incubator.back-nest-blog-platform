import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import {
  titleConstraints,
  shortDescriptionConstraints,
  contentConstraints,
} from '../../../posts/domain/post.constraints';

export class CreatePostByBlogIdInputDto {
  @IsStringWithTrim({
    maxLength: titleConstraints.maxLength,
  })
  title: string;

  @IsStringWithTrim({
    maxLength: shortDescriptionConstraints.maxLength,
  })
  shortDescription: string;

  @IsStringWithTrim({
    maxLength: contentConstraints.maxLength,
  })
  content: string;
}
