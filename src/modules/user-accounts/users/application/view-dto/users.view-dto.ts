import { OmitType } from '@nestjs/swagger';
import { IUserEntityDto } from '../../domain/dto/user.entity.dto';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(user: IUserEntityDto): UserViewDto {
    const dto = new UserViewDto();

    dto.id = user.id;
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

  static mapToView(user: IUserEntityDto): MeViewDto {
    const dto = new MeViewDto();

    dto.userId = user.id;
    dto.email = user.email;
    dto.login = user.login;

    return dto;
  }
}
