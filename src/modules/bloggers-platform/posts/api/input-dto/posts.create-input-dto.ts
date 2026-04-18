import { IsString } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import {
  contentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../../domain/post.constraints';

export class CreatePostInputDto {
  @IsString()
  blogId: string;

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
