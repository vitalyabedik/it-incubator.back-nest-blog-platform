import { Injectable } from '@nestjs/common';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentViewDto } from '../view-dto/comments.view-dto';
import { ICreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentsFactory {
  constructor(private commentsRepository: CommentsRepository) {}

  async createComment(dto: ICreateCommentDto): Promise<CommentViewDto> {
    const newComment = await this.commentsRepository.createComment(dto);

    return CommentViewDto.mapToView({
      id: newComment.id,
      userId: newComment.ownerId,
      content: newComment.content,
      createdAt: newComment.createdAt,
      likesCount: 0,
      dislikesCount: 0,
      myStatus: ELikeStatus.None,
      userLogin: dto.login,
    });
  }
}
