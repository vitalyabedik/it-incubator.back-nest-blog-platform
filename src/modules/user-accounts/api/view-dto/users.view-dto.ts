import { OmitType } from '@nestjs/swagger';
import { TUserDocument } from '../../domain/user.entity';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(user: TUserDocument): UserViewDto {
    const dto = new UserViewDto();

    dto.id = user._id.toString();
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt.toISOString();

    return dto;
  }
}

export class MeViewDto extends OmitType(UserViewDto, [
  'createdAt',
  'id',
] as const) {
  userId: string;

  static mapToView(user: TUserDocument): MeViewDto {
    const dto = new MeViewDto();

    dto.userId = user._id.toString();
    dto.email = user.email;
    dto.login = user.login;

    return dto;
  }
}
