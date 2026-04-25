export const routersPaths = {
  root: '/',
  byId: ':id',
  auth: {
    root: 'auth',
    me: 'me',
    registration: 'registration',
    login: 'login',
    logout: 'logout',
    newPassword: 'new-password',
    passwordRecovery: 'password-recovery',
    registrationConfirmation: 'registration-confirmation',
    registrationEmailResending: 'registration-email-resending',
    refreshToken: 'refresh-token',
  },
  users: {
    root: 'users',
  },
  security: {
    root: 'security',
    devices: 'devices',
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
  likeStatus: ':id/like-status',
  testing: {
    root: 'testing',
    resetDb: 'all-data',
  },
};
