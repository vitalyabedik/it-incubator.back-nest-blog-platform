import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  TBlogDocument,
  TBlogModel,
} from '../../../blogs/domain/blog.entity';
import { CreateBlogInputDto } from '../../api/input-dto/blogs.create-input-dto';

@Injectable()
export class BlogsFactory {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: TBlogModel,
  ) {}

  async createBlog(dto: CreateBlogInputDto): Promise<TBlogDocument> {
    const newBlog = this.BlogModel.createInstance(dto);

    return newBlog;
  }
}
