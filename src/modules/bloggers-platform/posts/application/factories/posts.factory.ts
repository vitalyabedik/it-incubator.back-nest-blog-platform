import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostInputDto } from '../../api/input-dto/posts.create-input-dto';
import { Post, TPostDocument, TPostModel } from '../../domain/post.entity';

@Injectable()
export class PostsFactory {
  constructor(
    @InjectModel(Post.name)
    private PostModel: TPostModel,
  ) {}

  async createPost(
    blogName: string,
    dto: CreatePostInputDto,
  ): Promise<TPostDocument> {
    const newPost = await this.PostModel.createInstance(blogName, dto);

    return newPost;
  }
}
