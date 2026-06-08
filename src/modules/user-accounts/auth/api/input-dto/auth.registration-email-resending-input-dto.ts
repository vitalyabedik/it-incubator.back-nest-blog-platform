import { Matches } from 'class-validator';
import { emailConstraints } from '../../../users/domain/user.constraints';

export class AuthRegistrationEmailResendingInputDto {
  @Matches(emailConstraints.match)
  email: string;
}
