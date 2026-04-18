import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { Blog, TBlogModel } from '../../domain/blog.entity';
import { GetBlogsQueryParams } from '../../api/input-dto/get-blogs-query-params.input-dto';
import { BlogViewDto } from '../../application/view-dto/blogs.view-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: TBlogModel,
  ) {}

  async getBlogList(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const filter = query.getFilter();

    const [items, totalCount] = await Promise.all([
      this.BlogModel.find(filter)
        .sort(query.getSortOptions())
        .skip(query.calculateSkip())
        .limit(query.pageSize)
        .lean()
        .exec(),
      this.BlogModel.countDocuments(filter).exec(),
    ]);

    const blogsViewList = items.map(BlogViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: blogsViewList,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getBlogById(blogId: string): Promise<BlogViewDto> {
    const blog = await this.BlogModel.findOne({
      _id: blogId,
      deletedAt: null,
    }).exec();

    if (!blog) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return BlogViewDto.mapToView(blog);
  }
}
