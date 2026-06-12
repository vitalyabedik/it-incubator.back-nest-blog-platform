import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { errorMessages } from '../../constants/texts';
import { IBlogEntityDto } from '../../domain/dto/blog.entity.dto';
import { IBlogRepositoryDto } from '../dto/blog-repository.dto';
import { IGetBlogListParamsDto } from './dto/get-blog-list.params.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getBlogList(query: IGetBlogListParamsDto): Promise<{
    blogs: IBlogEntityDto[];
    totalCount: number;
  }> {
    const { searchNameTerm, sortBy, sortDirection, limit, offset } = query;

    const blogsPromise: Promise<IBlogRepositoryDto[]> = this.dataSource.query(
      `
      SELECT *
        FROM blogs
        WHERE (name ILIKE $1) AND "deletedAt" IS NULL
        ORDER BY ${`"${sortBy}"`} ${sortDirection}
        LIMIT $2
        OFFSET $3
      `,
      [`%${searchNameTerm || ''}%`, limit, offset],
    );

    const totalCountPromise: Promise<[{ count: string }]> =
      this.dataSource.query(
        `
      SELECT COUNT(*)
        FROM blogs
        WHERE (name ILIKE $1) AND "deletedAt" IS NULL
      `,
        [`%${searchNameTerm || ''}%`],
      );

    const [blogsResult, countResult] = await Promise.all([
      blogsPromise,
      totalCountPromise,
    ]);

    return {
      blogs: blogsResult,
      totalCount: Number(countResult[0].count),
    };
  }

  async getBlogByIdOrThrow(id: string): Promise<IBlogEntityDto> {
    const [blog]: IBlogEntityDto[] = await this.dataSource.query(
      `
      SELECT *
        FROM blogs
        WHERE id=$1 AND "deletedAt" IS NULL
      `,
      [id],
    );

    if (!blog) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    return blog;
  }
}
