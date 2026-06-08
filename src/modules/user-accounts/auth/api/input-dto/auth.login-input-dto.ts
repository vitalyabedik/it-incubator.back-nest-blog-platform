import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginInputDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;
}
