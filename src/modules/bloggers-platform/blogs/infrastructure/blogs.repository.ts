import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { errorMessages } from '../constants/texts';
import { Blog, TBlogDocument, TBlogModel } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: TBlogModel) {}

  async findBlogById(id: string): Promise<TBlogDocument> {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!blog) {
      throw new NotFoundException(errorMessages.notFound);
    }

    return blog;
  }

  async save(blog: TBlogDocument) {
    await blog.save();
  }
}
