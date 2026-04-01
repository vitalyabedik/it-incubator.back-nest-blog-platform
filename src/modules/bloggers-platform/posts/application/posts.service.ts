import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { Post, TPostModel } from '../domain/post.entity';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CreatePostInputDto } from '../api/input-dto/posts.create-input-dto';
import { UpdatePostInputDto } from '../api/input-dto/posts.update-input-dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: TPostModel,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostInputDto): Promise<string> {
    const blog = await this.blogsRepository.findBlogById(dto.blogId);

    const post = this.PostModel.createInstance(blog.name, dto);

    await this.postsRepository.save(post);

    return post._id.toString();
  }

  async updatePost(postId, dto: UpdatePostInputDto): Promise<void> {
    const post = await this.postsRepository.findPostById(postId);

    const updatedPost = post.updateInstance(dto);

    await this.postsRepository.save(updatedPost);
  }

  async deletePost(postId: string): Promise<void> {
    const post = await this.postsRepository.findPostById(postId);

    post.softDelete();

    await this.postsRepository.save(post);
  }
}
