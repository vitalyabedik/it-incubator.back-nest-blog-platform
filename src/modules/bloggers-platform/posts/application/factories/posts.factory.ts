import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostViewDto } from '../view-dto/posts.view-dto';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { ICreatePostDto } from '../../dto/create-post.dto';

@Injectable()
export class PostsFactory {
  constructor(private postsRepository: PostsRepository) {}

  async createPost(dto: ICreatePostDto) {
    const newPost = await this.postsRepository.create(dto);

    return PostViewDto.mapToView({
      post: {
        ...newPost,
        likesCount: 0,
        dislikesCount: 0,
        myStatus: ELikeStatus.None,
      },
      newestLikes: [],
    });
  }
}
