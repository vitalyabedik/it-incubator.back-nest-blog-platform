import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, TLikeModel } from '../../domain/like.entity';

@Injectable()
export class LikesExternalRepository {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: TLikeModel,
  ) {}

  async delete() {
    await this.LikeModel.deleteMany();
  }
}
