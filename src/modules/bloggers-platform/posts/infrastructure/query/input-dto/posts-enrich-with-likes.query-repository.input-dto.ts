import { TPostDocument } from '../../../domain/post.entity';

export class PostsEnrichWithLikesQueryRepositoryParams {
  posts: TPostDocument[];
  userId?: string;
}
