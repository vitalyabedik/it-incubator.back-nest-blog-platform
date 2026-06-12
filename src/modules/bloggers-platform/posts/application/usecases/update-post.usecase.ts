import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { IUpdatePostDto } from './dto/update-post.dto';

export class UpdatePostCommand {
  constructor(public dto: IUpdatePostDto) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<
  UpdatePostCommand,
  boolean
> {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ dto }: UpdatePostCommand): Promise<boolean> {
    const isUpdated = await this.postsRepository.update(dto);

    if (!isUpdated) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return true;
  }
}
