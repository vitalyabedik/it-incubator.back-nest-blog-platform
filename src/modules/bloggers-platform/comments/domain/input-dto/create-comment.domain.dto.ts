import { CreateCommentInputDto } from '../../api/input-dto/comment.create-input-dto';
import { CommentatorInfo } from '../commentator-info.schema';

export class CreateCommentDomainDto {
  postId: string;
  commentDto: CreateCommentInputDto;
  commentatorInfo: CommentatorInfo;
}
