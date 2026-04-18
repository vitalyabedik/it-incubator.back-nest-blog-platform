import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../constants/texts';
import {
  Comment,
  TCommentDocument,
  TCommentModel,
} from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private CommentModel: TCommentModel) {}

  async findCommentByIdOrThrow(id: string): Promise<TCommentDocument> {
    const comment = await this.CommentModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!comment) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return comment;
  }

  async save(comment: TCommentDocument) {
    await comment.save();
  }
}
