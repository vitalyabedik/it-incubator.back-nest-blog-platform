import { ELikeStatus } from '../../../likes/constants/like-status';
import { IPostEntityDto } from '../../domain/dto/post.entity.dto';
import { INewestLike } from '../../infrastructure/query/dto/newest-like.dto';

export interface IPostWithDetails extends Omit<IPostEntityDto, 'deletedAt'> {
  blogName: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: ELikeStatus;
}

class NewestLike {
  userId: string;
  login: string;
  addedAt: string;
}

class ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: ELikeStatus;
  newestLikes: NewestLike[];
}

class Args {
  post: IPostWithDetails;
  newestLikes: INewestLike[];
}

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;

  static mapToView(args: Args): PostViewDto {
    const { post, newestLikes } = args;
    const dto = new PostViewDto();

    dto.id = post.id;
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();

    dto.extendedLikesInfo = {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      myStatus: post.myStatus,
      newestLikes: newestLikes.map((item) => ({
        login: item.login,
        userId: item.userId,
        addedAt: item.addedAt.toISOString(),
      })),
    };

    return dto;
  }
}
