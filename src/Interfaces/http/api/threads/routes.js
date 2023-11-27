const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forum_auth',
    },
  },
  {
    method: 'GET',
    path: '/threads/{id}',
    handler: handler.getThreadHandler,
  },
]);

module.exports = routes;
