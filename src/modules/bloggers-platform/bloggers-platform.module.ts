import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';

import { UserAccountsModule } from '../user-accounts/user-accounts.module';

import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsExternalRepository } from './blogs/infrastructure/external/blogs.external-repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { FindBlogByIdQueryHandler } from './blogs/application/queries/find-blog-by-id.query-handler';
import { GetBlogByIdQuery } from './blogs/application/queries/get-blog-by-id.query-handler';
import { GetBlogListQuery } from './blogs/application/queries/get-blog-list.query-handler';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { UpdateBlogCommand } from './blogs/application/usecases/update-blog.usecase';

import { PostsController } from './posts/api/posts.controller';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsExternalRepository } from './posts/infrastructure/external/posts.external-repository';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { Post, PostSchema } from './posts/domain/post.entity';
import { FindPostByIdQueryHandler } from './posts/application/queries/find-post-by-id.query-handler';
import { GetPostByIdQueryHandler } from './posts/application/queries/get-post-by-id.query-handler';
import { GetPostListByBlogIdQueryHandler } from './posts/application/queries/get-post-list-by-blogId.query-handler';
import { GetPostListQueryHandler } from './posts/application/queries/get-post-list.query-handler';
import { CreatePostUseCase } from './posts/application/usecases/create-post.usecase';
import { DeletePostUseCase } from './posts/application/usecases/delete-post.usecase';
import { UpdatePostUseCase } from './posts/application/usecases/update-post.usecase';

import { CommentsController } from './comments/api/comments.controller';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';
import { CommentSchema, Comment } from './comments/domain/comment.entity';
import { GetCommentListByPostIdQueryHandler } from './comments/application/queries/get-comment-list-by-postId.query-handler';

import { LikesExternalRepository } from './likes/infrastructure/external/likes-external.repository';
import { Like, LikeSchema } from './likes/domain/like.entity';
import { LikesRepository } from './likes/infrastructure/likes.repository';

const commandHandlers = [
  CreateBlogUseCase,
  UpdateBlogCommand,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
];
const queryHandlers = [
  FindBlogByIdQueryHandler,
  GetBlogByIdQuery,
  GetBlogListQuery,
  FindPostByIdQueryHandler,
  GetPostByIdQueryHandler,
  GetPostListByBlogIdQueryHandler,
  GetPostListQueryHandler,
  GetCommentListByPostIdQueryHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    UserAccountsModule,
    CqrsModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsRepository,
    PostsRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
    BlogsExternalRepository,
    PostsExternalRepository,
    LikesExternalRepository,
    LikesRepository,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [
    BlogsExternalRepository,
    PostsExternalRepository,
    LikesExternalRepository,
  ],
})
export class BloggersPlatformModule {}
