import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, TLikeDocument, TLikeModel } from '../domain/like.entity';
import { CreateLikeDomainDto } from '../domain/input-dto/create-like.domain.dto';

@Injectable()
export class LikesFactory {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: TLikeModel,
  ) {}

  async createLike(dto: CreateLikeDomainDto): Promise<TLikeDocument> {
    const newLike = await this.LikeModel.createInstance(dto);

    return newLike;
  }
}
