import { ELikeStatus } from '../../../likes/constants/like-status';
import { ICommentsWithDetailsDto } from '../../infrastructure/query/input-dto/comment-with-details.dto';

export class CommentatorInfo {
  userId: string;
  userLogin: string;
}

class LikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: ELikeStatus;
}

export class CommentViewDto {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfo;

  static mapToView(comment: ICommentsWithDetailsDto): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = comment.id;
    dto.content = comment.content;
    dto.createdAt = comment.createdAt.toISOString();
    dto.commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };
    dto.likesInfo = {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      myStatus: comment.myStatus,
    };

    return dto;
  }
}
