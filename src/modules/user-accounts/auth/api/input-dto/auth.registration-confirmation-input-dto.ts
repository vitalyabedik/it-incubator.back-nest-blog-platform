import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { errorMessages } from '../../constants/texts';

export class AuthRegistrationConfirmationInputDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID(undefined, { message: errorMessages.incorrectConfirmationCode })
  code: string;
}
