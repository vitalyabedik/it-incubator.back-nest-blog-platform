export const routersPaths = {
  root: '/',
  byId: ':id',
  auth: {
    root: 'auth',
    me: 'me',
    registration: 'registration',
    login: 'login',
    newPassword: 'new-password',
    passwordRecovery: 'password-recovery',
    registrationConfirmation: 'registration-confirmation',
    registrationEmailResending: 'registration-email-resending',
  },
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
