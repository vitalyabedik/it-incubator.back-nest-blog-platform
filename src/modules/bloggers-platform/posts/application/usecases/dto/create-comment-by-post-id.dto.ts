export interface ICreateCommentByPostIdDto {
  postId: string;
  userId: string;
  login: string;
  content: string;
}
