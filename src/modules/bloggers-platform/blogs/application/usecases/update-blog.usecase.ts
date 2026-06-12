import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { IUpdateBlogDto } from '../dto/update-blog.dto';

export class UpdateBlogCommand {
  constructor(public dto: IUpdateBlogDto) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<
  UpdateBlogCommand,
  boolean
> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ dto }: UpdateBlogCommand): Promise<boolean> {
    const isUpdated = await this.blogsRepository.updateBlog(dto);

    if (!isUpdated) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return true;
  }
}
