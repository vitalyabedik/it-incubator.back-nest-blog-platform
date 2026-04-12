import { TLikeDocument } from 'src/modules/bloggers-platform/likes/domain/like.entity';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { TPostDocument } from '../../domain/post.entity';

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
  post: TPostDocument;
  newestLikes: TLikeDocument[];
  myStatus: ELikeStatus;
}

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  extendedLikesInfo: ExtendedLikesInfo;
  createdAt: string;

  static mapToView({ post, newestLikes, myStatus }: Args): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();

    dto.extendedLikesInfo = {
      likesCount: post.likesInfo.likesCount,
      dislikesCount: post.likesInfo.dislikesCount,
      myStatus: myStatus,
      newestLikes: newestLikes.map((like) => ({
        userId: like.authorId,
        login: like.login,
        addedAt: like.addedLikeDate?.toISOString() || '',
      })),
    };

    return dto;
  }
}
