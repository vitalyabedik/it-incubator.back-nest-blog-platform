import { Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import {
  descriptionConstraints,
  nameConstraints,
  webSiteUrlConstraints,
} from '../../domain/blog.constraints';

export class UpdateBlogInputDto {
  @IsStringWithTrim({
    maxLength: nameConstraints.maxLength,
  })
  name: string;

  @IsStringWithTrim({
    maxLength: descriptionConstraints.maxLength,
  })
  description: string;

  @IsStringWithTrim({
    maxLength: webSiteUrlConstraints.maxLength,
  })
  @Matches(webSiteUrlConstraints.match)
  websiteUrl: string;
}
