import { Controller } from '@nestjs/common';
import { routersPaths } from '../../../../core/constants/paths';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';

@Controller(routersPaths.comments.root)
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {
    console.log('CommentsController created');
  }
}
