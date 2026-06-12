import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';

export class DeleteBlogCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<
  DeleteBlogCommand,
  boolean
> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ blogId }: DeleteBlogCommand): Promise<boolean> {
    const isDeleted = await this.blogsRepository.softDelete(blogId);

    if (!isDeleted) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return true;
  }
}
