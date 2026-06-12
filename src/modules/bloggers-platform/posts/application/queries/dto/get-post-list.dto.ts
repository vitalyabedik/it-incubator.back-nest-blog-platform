import { IGetPostListQueryDto } from '../../../dto/get-post-list-query.dto';

export interface IGetPostListDto {
  query: IGetPostListQueryDto;
  userId?: string;
}
