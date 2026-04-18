import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Comment, TCommentModel } from '../../domain/comment.entity';

@Injectable()
export class CommentsExternalRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: TCommentModel,
  ) {}

  async delete() {
    await this.CommentModel.deleteMany();
  }
}
