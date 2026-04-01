export const routersPaths = {
  root: '/',
  byId: ':id',
  users: {
    root: 'users',
  },
  blogs: {
    root: 'blogs',
    postsByBlogId: ':id/posts',
  },
  posts: {
    root: 'posts',
    commentsByPostId: ':id/comments',
  },
  comments: {
    root: 'comments',
  },
  testing: {
    root: 'testing',
    resetDb: 'all-data',
  },
};
