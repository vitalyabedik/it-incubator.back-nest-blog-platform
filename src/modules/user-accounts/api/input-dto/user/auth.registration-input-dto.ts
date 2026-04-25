import { Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import {
  emailConstraints,
  loginConstraints,
  passwordConstraints,
} from '../../../domain/user.constraints';

export class AuthRegistrationInputDto {
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
