import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../constants/texts';
import { Post, TPostDocument, TPostModel } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: TPostModel) {}

  async findPostById(id: string): Promise<TPostDocument> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!post) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return post;
  }

  async save(post: TPostDocument) {
    await post.save();
  }
}
