import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { errorMessages } from '../../constants/texts';
import { IUpdatePostLikeStatusDto } from './dto/update-post-like-status.dto';

export class UpdatePostLikeStatusCommand {
  constructor(public dto: IUpdatePostLikeStatusDto) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase implements ICommandHandler<
  UpdatePostLikeStatusCommand,
  boolean
> {
  constructor(
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
  ) {}
  s;
  async execute({ dto }: UpdatePostLikeStatusCommand): Promise<boolean> {
    const post = await this.postsRepository.findPostById(dto.postId);

    if (!post) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    await this.likesRepository.updatePostLike(dto);

    return true;
  }
}
