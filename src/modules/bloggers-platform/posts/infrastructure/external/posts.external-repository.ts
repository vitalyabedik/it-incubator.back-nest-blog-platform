import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Post, TPostModel } from '../../domain/post.entity';

@Injectable()
export class PostsExternalRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: TPostModel,
  ) {}

  async delete() {
    await this.PostModel.deleteMany();
  }
}
