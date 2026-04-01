import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, TLikeDocument, TLikeModel } from '../domain/like.entity';
import { ELikeStatus } from '../constants/like-status';
import { GetLikeListRepositoryParams } from './input-dto/get-like-list-for-user.repository.input-dto';
import { GetLikeMyStatusRepositoryParams } from './input-dto/get-like-my-status.repository.input-dto';
import { GetLikeListNewestRepositoryParams } from './input-dto/get-like-list-newest.repository.input-dto';
import { GetLikeListNewestForParentsRepositoryParams } from './input-dto/get-like-list-newest-for-parents.repository.input-dto';

const DEFAULT_LIKES_LIMIT_COUNT = 3;

type TNewestLikesAggregationResult = {
  _id: Types.ObjectId;
  newestLikes: TLikeDocument[];
};

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: TLikeModel,
  ) {}

  async getLikeListForUser({
    authorId,
    parentIds,
  }: GetLikeListRepositoryParams) {
    return this.LikeModel.find({
      parentId: { $in: parentIds },
      authorId,
    })
      .lean()
      .exec();
  }

  async getMyStatus({ parentId, authorId }: GetLikeMyStatusRepositoryParams) {
    const like = await this.LikeModel.findOne({ parentId, authorId })
      .lean()
      .exec();

    return like?.status || ELikeStatus.None;
  }

  async getNewestLikeList({
    parentId,
    limit = DEFAULT_LIKES_LIMIT_COUNT,
  }: GetLikeListNewestRepositoryParams) {
    return this.LikeModel.find({ parentId, status: ELikeStatus.Like })
      .sort({ addedLikeDate: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  async getNewestLikeListForParents({
    parentIds,
    limit = DEFAULT_LIKES_LIMIT_COUNT,
  }: GetLikeListNewestForParentsRepositoryParams) {
    return this.LikeModel.aggregate<TNewestLikesAggregationResult>([
      {
        $match: {
          parentId: { $in: parentIds },
          status: ELikeStatus.Like,
        },
      },
      {
        $group: {
          _id: '$parentId',
          newestLikes: {
            $topN: {
              n: limit,
              sortBy: { addedLikeDate: -1 },
              output: '$$ROOT',
            },
          },
        },
      },
    ]);
  }
}
