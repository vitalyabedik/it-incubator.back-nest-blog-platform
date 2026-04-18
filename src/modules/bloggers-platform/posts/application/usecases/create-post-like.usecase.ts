import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { ELikeStatus } from '../../../likes/constants/like-status';
import { LikesFactory } from '../../../likes/factories/likes.factory';
import { CreatePostLikeInputDto } from '../../api/input-dto/posts.create-like-input-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class CreatePostLikeCommand {
  constructor(public dto: CreatePostLikeInputDto) {}
}

@CommandHandler(CreatePostLikeCommand)
export class CreatePostLikeUseCase implements ICommandHandler<
  CreatePostLikeCommand,
  boolean
> {
  constructor(
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
    private likesFactory: LikesFactory,
  ) {}

  async execute({ dto }: CreatePostLikeCommand): Promise<boolean> {
    const { post, userId, login, likeStatus } = dto;

    if (likeStatus === ELikeStatus.None) return true;

    const parentId = post._id.toString();

    const createdLike = await this.likesFactory.createLike({
      authorId: userId,
      login,
      parentId,
      status: likeStatus,
    });

    const updatedPost = post.updatePostLikesByIncomingLikeStatus(likeStatus);

    await this.likesRepository.save(createdLike);
    await this.postsRepository.save(updatedPost);

    return true;
  }
}
