import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  TCommentModel,
  TCommentDocument,
} from '../../domain/comment.entity';
import { CreateCommentDomainDto } from '../../domain/input-dto/create-comment.domain.dto';

@Injectable()
export class CommentsFactory {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: TCommentModel,
  ) {}

  async createComment(dto: CreateCommentDomainDto): Promise<TCommentDocument> {
    const newComment = await this.CommentModel.createInstance(dto);

    return newComment;
  }
}
