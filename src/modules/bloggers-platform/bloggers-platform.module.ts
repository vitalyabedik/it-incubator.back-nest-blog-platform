import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { UserAccountsModule } from '../user-accounts/user-accounts.module';

import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsExternalRepository } from './blogs/infrastructure/external/blogs.external-repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { FindBlogByIdQueryHandler } from './blogs/application/queries/find-blog-by-id.query-handler';
import { GetBlogByIdQueryHandler } from './blogs/application/queries/get-blog-by-id.query-handler';
import { GetBlogListQueryHandler } from './blogs/application/queries/get-blog-list.query-handler';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { BlogsFactory } from './blogs/application/factories/blogs.factory';

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
import { UpdatePostLikeUseCase } from './posts/application/usecases/update-post-like.usecase';
import { UpdatePostLikeStatusUseCase } from './posts/application/usecases/update-post-like-status.usecase';
import { CreatePostLikeUseCase } from './posts/application/usecases/create-post-like.usecase';
import { PostsFactory } from './posts/application/factories/posts.factory';

import { CommentsController } from './comments/api/comments.controller';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';
import { CommentSchema, Comment } from './comments/domain/comment.entity';
import { GetCommentListByPostIdQueryHandler } from './comments/application/queries/get-comment-list-by-postId.query-handler';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsExternalRepository } from './comments/infrastructure/external/comments.external-repository';
import { GetCommentByIdQueryHandler } from './comments/application/queries/get-comment-by-postId.query-handler';
import { CreateCommentLikeUseCase } from './comments/application/usecases/create-comment-like.usecase';
import { CreateCommentUseCase } from './comments/application/usecases/create-comment.usecase';
import { DeleteCommentUseCase } from './comments/application/usecases/delete-comment.usecase';
import { UpdateCommentLikeStatusUseCase } from './comments/application/usecases/update-comment-like-status.usecase';
import { UpdateCommentLikeUseCase } from './comments/application/usecases/update-comment-like.usecase';
import { UpdateCommentUseCase } from './comments/application/usecases/update-comment.usecase';
import { CommentsFactory } from './comments/application/factories/comments.factory';

import { LikesExternalRepository } from './likes/infrastructure/external/likes-external.repository';
import { Like, LikeSchema } from './likes/domain/like.entity';
import { LikesRepository } from './likes/infrastructure/likes.repository';
import { LikesFactory } from './likes/factories/likes.factory';

const commandHandlers = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  CreatePostLikeUseCase,
  UpdatePostLikeUseCase,
  UpdatePostLikeStatusUseCase,
  DeletePostUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CreateCommentLikeUseCase,
  UpdateCommentLikeStatusUseCase,
  UpdateCommentLikeUseCase,
];
const queryHandlers = [
  FindBlogByIdQueryHandler,
  GetBlogByIdQueryHandler,
  GetBlogListQueryHandler,
  FindPostByIdQueryHandler,
  GetPostByIdQueryHandler,
  GetPostListByBlogIdQueryHandler,
  GetPostListQueryHandler,
  GetCommentListByPostIdQueryHandler,
  GetCommentByIdQueryHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    JwtModule,
    UserAccountsModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsRepository,
    PostsRepository,
    CommentsRepository,
    LikesRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
    BlogsExternalRepository,
    PostsExternalRepository,
    CommentsExternalRepository,
    LikesExternalRepository,
    BlogsFactory,
    PostsFactory,
    CommentsFactory,
    LikesFactory,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [
    BlogsExternalRepository,
    PostsExternalRepository,
    CommentsExternalRepository,
    LikesExternalRepository,
  ],
})
export class BloggersPlatformModule {}
