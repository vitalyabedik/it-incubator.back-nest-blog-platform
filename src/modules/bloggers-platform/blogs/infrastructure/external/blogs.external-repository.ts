import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Blog, TBlogModel } from '../../domain/blog.entity';

@Injectable()
export class BlogsExternalRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: TBlogModel,
  ) {}

  async delete() {
    await this.BlogModel.deleteMany();
  }
}
