import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { Blog, TBlogModel } from '../domain/blog.entity';
import { CreateBlogInputDto } from '../api/input-dto/blogs.create-input-dto';
import { UpdateBlogInputDto } from '../api/input-dto/blogs.update-input-dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: TBlogModel,
    private blogsRepository: BlogsRepository,
  ) {}

  async createBlog(dto: CreateBlogInputDto): Promise<string> {
    const blog = this.BlogModel.createInstance(dto);

    await this.blogsRepository.save(blog);

    return blog._id.toString();
  }

  async updateBlog(blogId: string, dto: UpdateBlogInputDto): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(blogId);

    const updatedBlog = blog.updateInstance(dto);

    await this.blogsRepository.save(updatedBlog);
  }

  async deleteBlog(blogId: string): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(blogId);

    blog.softDelete();

    await this.blogsRepository.save(blog);
  }
}
