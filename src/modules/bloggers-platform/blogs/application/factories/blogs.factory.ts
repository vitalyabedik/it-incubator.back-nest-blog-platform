import { Injectable } from '@nestjs/common';
import { CreateBlogInputDto } from '../../api/input-dto/blogs.create-input-dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogViewDto } from '../view-dto/blogs.view-dto';

@Injectable()
export class BlogsFactory {
  constructor(private blogsRepository: BlogsRepository) {}

  async createBlog(dto: CreateBlogInputDto): Promise<BlogViewDto> {
    const newBlog = await this.blogsRepository.createBlog(dto);

    return BlogViewDto.mapToView(newBlog);
  }
}
