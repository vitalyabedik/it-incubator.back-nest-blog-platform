import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRegistrationConfirmationInputDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
