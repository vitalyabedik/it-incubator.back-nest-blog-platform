import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { routersPaths } from '../../../../core/constants/paths';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ID_PARAMETER } from '../../../../core/constants/params';

import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from '../../posts/api/view-dto/posts.view-dto';
import { CreatePostInputDto } from '../../posts/api/input-dto/posts.create-input-dto';

import { BlogsService } from '../application/blogs.service';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { BlogViewDto } from './view-dto/blogs.view-dto';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { CreateBlogInputDto } from './input-dto/blogs.create-input-dto';
import { UpdateBlogInputDto } from './input-dto/blogs.update-input-dto';

@Controller(routersPaths.blogs.root)
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {
    console.log('BlogsController created');
  }

  @Get()
  async getBlogList(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getBlogList(query);
  }

  @Get(routersPaths.byId)
  async getBlogById(@Param(ID_PARAMETER) id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getBlogById(id);
  }

  @Post()
  async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.createBlog(body);

    return this.blogsQueryRepository.getBlogById(blogId);
  }

  @ApiParam({ name: ID_PARAMETER })
  @Put(routersPaths.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param(ID_PARAMETER) id: string,
    @Body() body: UpdateBlogInputDto,
  ): Promise<void> {
    return this.blogsService.updateBlog(id, body);
  }

  @ApiParam({ name: ID_PARAMETER })
  @Delete(routersPaths.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param(ID_PARAMETER) id: string): Promise<void> {
    return this.blogsService.deleteBlog(id);
  }

  @Get(`${routersPaths.byId}/${routersPaths.posts.root}`)
  async getPostListByBlogId(
    @Param(ID_PARAMETER) id: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.blogsRepository.findBlogById(id);

    return this.postsQueryRepository.getPostListByBlogId({
      blogId: id,
      query,
    });
  }

  @Post(`${routersPaths.byId}/${routersPaths.posts.root}`)
  async createPostByBlogId(
    @Param(ID_PARAMETER) id: string,
    @Body() body: CreatePostInputDto,
  ): Promise<PostViewDto> {
    const postId = await this.postsService.createPost({ ...body, blogId: id });

    return this.postsQueryRepository.getPostById({
      postId,
    });
  }
}
