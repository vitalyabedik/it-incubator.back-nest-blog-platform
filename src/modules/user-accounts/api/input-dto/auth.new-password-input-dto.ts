import { IsNotEmpty } from 'class-validator';
import { passwordConstraints } from './../../domain/user.constraints';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';

export class AuthNewPasswordInputDto {
  @IsStringWithTrim({
    minLength: passwordConstraints.minLength,
    maxLength: passwordConstraints.maxLength,
  })
  newPassword: string;

  @IsNotEmpty()
  recoveryCode: string;
}
