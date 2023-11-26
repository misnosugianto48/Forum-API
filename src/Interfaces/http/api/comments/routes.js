const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentThreadHandler,
    options: {
      auth: 'forum_auth',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentThreadHandler,
    options: {
      auth: 'forum_auth',
    },
  },
]);

module.exports = routes;
