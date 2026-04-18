import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, TLikeDocument, TLikeModel } from '../domain/like.entity';
import { ELikeStatus } from '../constants/like-status';
import { FindLikeListRepositoryParams } from './input-dto/find-like-list-for-user.repository.input-dto';
import { FindLikeMyStatusRepositoryParams } from './input-dto/find-like-my-status.repository.input-dto';
import { FindLikeListNewestRepositoryParams } from './input-dto/find-like-list-newest.repository.input-dto';
import { FindLikeListNewestForParentsRepositoryParams } from './input-dto/find-like-list-newest-for-parents.repository.input-dto';
import { FindLikeByFilterRepositoryParams } from './input-dto/find-like-by-filter.repository.input-dto';

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

  async findLikeByFilter({
    authorId,
    parentId,
  }: FindLikeByFilterRepositoryParams): Promise<TLikeDocument | null> {
    return this.LikeModel.findOne({ parentId, authorId });
  }

  async findLikeListForUser({
    authorId,
    parentIds,
  }: FindLikeListRepositoryParams): Promise<TLikeDocument[]> {
    return this.LikeModel.find({
      parentId: { $in: parentIds },
      authorId,
    })
      .lean()
      .exec();
  }

  async findMyLikeStatus({
    parentId,
    authorId,
  }: FindLikeMyStatusRepositoryParams): Promise<ELikeStatus> {
    const like = await this.LikeModel.findOne({ parentId, authorId })
      .lean()
      .exec();
    if (!like) return ELikeStatus.None;

    return like.status;
  }

  async findNewestLikeList({
    parentId,
    limit = DEFAULT_LIKES_LIMIT_COUNT,
  }: FindLikeListNewestRepositoryParams): Promise<TLikeDocument[]> {
    return this.LikeModel.find({ parentId, status: ELikeStatus.Like })
      .sort({ addedLikeDate: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  async findNewestLikeListForParents({
    parentIds,
    limit = DEFAULT_LIKES_LIMIT_COUNT,
  }: FindLikeListNewestForParentsRepositoryParams): Promise<
    Map<string, TLikeDocument[]>
  > {
    const map = new Map<string, TLikeDocument[]>();

    const likes = await this.LikeModel.aggregate<TNewestLikesAggregationResult>(
      [
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
      ],
    );

    likes.forEach((item) => {
      map.set(item._id.toString(), item.newestLikes);
    });

    return map;
  }

  async save(likeDocument: TLikeDocument) {
    await likeDocument.save();
  }
}
