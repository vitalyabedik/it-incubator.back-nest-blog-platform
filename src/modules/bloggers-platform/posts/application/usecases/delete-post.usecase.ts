import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { errorMessages } from '../../constants/texts';
import { IDeletePostDto } from './dto/delete-post.dto';

export class DeletePostCommand {
  constructor(public dto: IDeletePostDto) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<
  DeletePostCommand,
  boolean
> {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ dto }: DeletePostCommand): Promise<boolean> {
    const isDeleted = await this.postsRepository.delete(dto);

    if (!isDeleted) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return true;
  }
}
