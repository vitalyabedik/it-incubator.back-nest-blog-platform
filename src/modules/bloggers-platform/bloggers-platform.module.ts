import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserAccountsModule } from '../user-accounts/user-accounts.module';

import { SuperAdminBlogsController } from './blogs/api/sa-blogs.controller';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { GetBlogByIdQueryHandler } from './blogs/application/queries/get-blog-by-id.query-handler';
import { GetBlogListQueryHandler } from './blogs/application/queries/get-blog-list.query-handler';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { BlogsFactory } from './blogs/application/factories/blogs.factory';

import { PostsController } from './posts/api/posts.controller';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { GetPostByIdQueryHandler } from './posts/application/queries/get-post-by-id.query-handler';
import { GetPostListByBlogIdQueryHandler } from './posts/application/queries/get-post-list-by-blogId.query-handler';
import { GetPostListQueryHandler } from './posts/application/queries/get-post-list.query-handler';
import { CreatePostUseCase } from './posts/application/usecases/create-post.usecase';
import { DeletePostUseCase } from './posts/application/usecases/delete-post.usecase';
import { UpdatePostUseCase } from './posts/application/usecases/update-post.usecase';
import { UpdatePostLikeStatusUseCase } from './posts/application/usecases/update-post-like-status.usecase';
import { PostsFactory } from './posts/application/factories/posts.factory';
import { GetCommentListByPostIdQueryHandler } from './posts/application/queries/get-comment-list-by-postId.query-handler';
import { CreateCommentByPostIdUseCase } from './posts/application/usecases/create-comment-by-post-id.usecase';

import { CommentsController } from './comments/api/comments.controller';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { GetCommentByIdQueryHandler } from './comments/application/queries/get-comment-by-id.query-handler';

import { DeleteCommentUseCase } from './comments/application/usecases/delete-comment.usecase';
import { UpdateCommentLikeStatusUseCase } from './comments/application/usecases/update-comment-like-status.usecase';

import { UpdateCommentContentUseCase } from './comments/application/usecases/update-comment-content.usecase';
import { CommentsFactory } from './comments/application/factories/comments.factory';

import { LikesRepository } from './likes/infrastructure/likes.repository';

const commandHandlers = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  CreateCommentByPostIdUseCase,
  UpdatePostLikeStatusUseCase,
  DeletePostUseCase,
  UpdateCommentContentUseCase,
  DeleteCommentUseCase,
  UpdateCommentLikeStatusUseCase,
];
const queryHandlers = [
  GetBlogByIdQueryHandler,
  GetBlogListQueryHandler,
  GetPostByIdQueryHandler,
  GetPostListByBlogIdQueryHandler,
  GetPostListQueryHandler,
  GetCommentListByPostIdQueryHandler,
  GetCommentByIdQueryHandler,
];

@Module({
  imports: [JwtModule, UserAccountsModule],
  controllers: [
    SuperAdminBlogsController,
    BlogsController,
    PostsController,
    CommentsController,
  ],
  providers: [
    BlogsRepository,
    PostsRepository,
    CommentsRepository,
    LikesRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
    BlogsFactory,
    PostsFactory,
    CommentsFactory,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
