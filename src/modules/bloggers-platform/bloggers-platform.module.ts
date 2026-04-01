import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserAccountsModule } from '../user-accounts/user-accounts.module';

import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsExternalRepository } from './blogs/infrastructure/external/blogs.external-repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';

import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsExternalRepository } from './posts/infrastructure/external/posts.external-repository';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { Post, PostSchema } from './posts/domain/post.entity';

import { CommentsController } from './comments/api/comments.controller';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';
import { CommentSchema, Comment } from './comments/domain/comment.entity';

import { LikesRepository } from './likes/infrastructure/likes.repository';
import { LikesExternalRepository } from './likes/infrastructure/external/likes-external.repository';
import { Like, LikeSchema } from './likes/domain/like.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    UserAccountsModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    PostsService,
    BlogsRepository,
    PostsRepository,
    LikesRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
    BlogsExternalRepository,
    PostsExternalRepository,
    LikesExternalRepository,
  ],
  exports: [
    BlogsExternalRepository,
    PostsExternalRepository,
    LikesExternalRepository,
  ],
})
export class BloggersPlatformModule {}
