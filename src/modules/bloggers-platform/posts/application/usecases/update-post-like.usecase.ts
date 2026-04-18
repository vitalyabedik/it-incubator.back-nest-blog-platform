import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { UpdatePostLikeInputDto } from '../../api/input-dto/posts.update-like-input-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostLikeCommand {
  constructor(public dto: UpdatePostLikeInputDto) {}
}

@CommandHandler(UpdatePostLikeCommand)
export class UpdatePostLikeUseCase implements ICommandHandler<
  UpdatePostLikeCommand,
  boolean
> {
  constructor(
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute({ dto }: UpdatePostLikeCommand): Promise<boolean> {
    const { like, post, likeStatus } = dto;

    const updatedPost = post.updatePostLikesByIncomingLikeStatusAndLike({
      like,
      likeStatus,
    });

    const updatedLike = like.updateLikeStatus(likeStatus);

    await this.likesRepository.save(updatedLike);
    await this.postsRepository.save(updatedPost);

    return true;
  }
}
