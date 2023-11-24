const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentThreadHandler,
    options: {
      auth: 'forum_auth',
    },
  },
]);

module.exports = routes;
