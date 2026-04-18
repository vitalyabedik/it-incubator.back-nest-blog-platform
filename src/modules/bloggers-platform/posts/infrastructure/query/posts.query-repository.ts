import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { EDomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

import { ELikeStatus } from '../../../likes/constants/like-status';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';

import { Post, TPostModel } from '../../domain/post.entity';
import { PostViewDto } from '../../application/view-dto/posts.view-dto';
import { errorMessages } from '../../constants/texts';
import { GetPostsListByBlogIdQueryRepositoryParams } from './input-dto/get-posts-list-by-blogId.query-repository.input-dto';
import { GetPostsListQueryRepositoryParams } from './input-dto/get-posts-list.query-repository.input-dto';
import { GetPostByIdQueryRepositoryParams } from './input-dto/get-post-by-id.query-repository.input-dto';
import { PostsEnrichWithLikesQueryRepositoryParams } from './input-dto/posts-enrich-with-likes.query-repository.input-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: TPostModel,
    private likesRepository: LikesRepository,
  ) {}

  async getPostList({
    query,
    userId,
  }: GetPostsListQueryRepositoryParams): Promise<
    PaginatedViewDto<PostViewDto[]>
  > {
    const filter = { deletedAt: null };

    const [posts, totalCount] = await Promise.all([
      this.PostModel.find(filter)
        .sort(query.getSortOptions())
        .skip(query.calculateSkip())
        .limit(query.pageSize)
        .lean()
        .exec(),
      this.PostModel.countDocuments(filter).exec(),
    ]);

    const postsWithLikeInfo = await this.enrichWithLikes({ posts, userId });

    const postsViewList = postsWithLikeInfo.map(PostViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: postsViewList,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getPostListByBlogId({
    blogId,
    userId,
    query,
  }: GetPostsListByBlogIdQueryRepositoryParams): Promise<
    PaginatedViewDto<PostViewDto[]>
  > {
    const filter = { blogId, deletedAt: null };

    const [posts, totalCount] = await Promise.all([
      this.PostModel.find(filter)
        .sort(query.getSortOptions())
        .skip(query.calculateSkip())
        .limit(query.pageSize)
        .lean()
        .exec(),
      this.PostModel.countDocuments(filter).exec(),
    ]);

    const postsWithLikeInfo = await this.enrichWithLikes({ posts, userId });

    const postsViewList = postsWithLikeInfo.map(PostViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: postsViewList,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getPostById({
    postId,
    userId,
  }: GetPostByIdQueryRepositoryParams): Promise<PostViewDto> {
    const post = await this.PostModel.findOne({
      _id: postId,
      deletedAt: null,
    }).exec();

    if (!post) {
      throw new DomainException({
        code: EDomainExceptionCode.NotFound,
        message: errorMessages.notFound,
      });
    }

    const myStatusPromise = userId
      ? this.likesRepository.findMyLikeStatus({
          parentId: postId,
          authorId: userId,
        })
      : Promise.resolve(ELikeStatus.None);

    const newestLikesPromise = this.likesRepository.findNewestLikeList({
      parentId: postId,
    });

    const [myStatus, newestLikes] = await Promise.all([
      myStatusPromise,
      newestLikesPromise,
    ]);

    return PostViewDto.mapToView({ post, newestLikes, myStatus });
  }

  async enrichWithLikes({
    posts,
    userId,
  }: PostsEnrichWithLikesQueryRepositoryParams) {
    if (posts.length === 0) return [];

    const likesMap = new Map<string, ELikeStatus>();

    const postsIds = posts.map((p) => p._id.toString());

    const userLikesPromise = userId
      ? this.likesRepository.findLikeListForUser({
          parentIds: postsIds,
          authorId: userId,
        })
      : Promise.resolve([]);

    const newestLikesPromise =
      this.likesRepository.findNewestLikeListForParents({
        parentIds: postsIds,
      });

    const [userLikes, newestLikesMap] = await Promise.all([
      userLikesPromise,
      newestLikesPromise,
    ]);

    userLikes.forEach((like) => likesMap.set(like.parentId, like.status));

    return posts.map((post) => {
      const myStatus = userId
        ? likesMap.get(post._id.toString()) || ELikeStatus.None
        : ELikeStatus.None;

      const newestLikes = newestLikesMap.get(post._id.toString()) || [];

      return {
        post,
        newestLikes,
        myStatus,
      };
    });
  }
}
