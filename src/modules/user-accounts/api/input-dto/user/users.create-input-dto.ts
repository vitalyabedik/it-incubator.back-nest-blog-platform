import { Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import {
  loginConstraints,
  passwordConstraints,
  emailConstraints,
} from '../../../domain/user.constraints';

export class CreateUserInputDto {
  @IsStringWithTrim({
    minLength: loginConstraints.minLength,
    maxLength: loginConstraints.maxLength,
  })
  @Matches(loginConstraints.match)
  login: string;

  @IsStringWithTrim({
    minLength: passwordConstraints.minLength,
    maxLength: passwordConstraints.maxLength,
  })
  password: string;

  @Matches(emailConstraints.match)
  email: string;
}
