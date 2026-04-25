import { Matches } from 'class-validator';
import { emailConstraints } from '../../../domain/user.constraints';

export class AuthPasswordRecoveryInputDto {
  @Matches(emailConstraints.match)
  email: string;
}
