/* eslint-disable max-len */
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentThreadsTableTestHelper = require('../../../../tests/CommentThreadTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when request doesn\'t have auth', async () => {
      // arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      // const authToken = await getAccessToken();
      const threadPayload = {
        title: 'some title thread',
        body: 'some body thread',
      };

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const threadJson = JSON.parse(responseThread.payload);
      const { addedThread } = threadJson.data;

      const requestPayload = {
        content: 'some comment thread',
      };

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
      // arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      // const authToken = await getAccessToken();

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-idFake/comments',
        payload: {
          content: 'some comment thread',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should repsponse 400 when request payload not contain needed property', async () => {
      // arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      // const authToken = await getAccessToken();

      const threadPayload = {
        title: 'some title thread',
        body: 'some body thread',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const threadJson = JSON.parse(threadResponse.payload);
      const { addedThread } = threadJson.data;

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: '',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // arrange
      const server = await createServer(container);

      /** Add user */
      const requestPayloadUser = {
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      // const authToken = await getAccessToken();

      const threadPayload = {
        title: 'some title thread',
        body: 'some body thread',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const threadJson = JSON.parse(threadResponse.payload);
      const { addedThread } = threadJson.data;

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 1234,
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response 201 and persist comment', async () => {
      // arrange
      const server = await createServer(container);

      /** Add user */
      const requestPayloadUser = {
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      // const authToken = await getAccessToken(server);
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some thread title',
          body: 'some body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadJson = JSON.parse(thread.payload);
      const { addedThread } = threadJson.data;

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'some comment thread correct' },
        headers: {
          authorization: `Bearer ${accessToken}`, // Add the valid token to the header
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when request doesn\'t have auth', async () => {
      // arrange
      const server = await createServer(container);

      /** Add user */
      const requestPayloadUser = {
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      // const authToken = await getAccessToken(server);

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some thread title',
          body: 'some body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadJson = JSON.parse(threadResponse.payload);
      const { addedThread } = threadJson.data;

      const commentThreadResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'some comment thread correct' },
        headers: {
          authorization: `Bearer ${accessToken}`, // Add the valid token to the header
        },
      });

      const commentThreadResponseJson = JSON.parse(commentThreadResponse.payload);

      const { addedComment } = commentThreadResponseJson.data;

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when comment not found', async () => {
      // arr
      const server = await createServer(container);

      /** Add user */
      const requestPayloadUser = {
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      // const authToken = await getAccessToken();

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some thread title',
          body: 'some body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadJson = JSON.parse(threadResponse.payload);
      const { addedThread } = threadJson.data;

      // act
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/comment-comment123`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 404 when thread not found', async () => {
      // arr
      const server = await createServer(container);

      /** Add user */
      const requestPayloadUser = {
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      // const authToken = await getAccessToken();
      // act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-thread123/comments/comment-comment123',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 403 when deleting other comment', async () => {
      // arr
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;
      // const authToken = await getAccessToken();
      await UsersTableTestHelper.addUser({ id: 'user-user456' });

      await ThreadsTableTestHelper.addThread({ id: 'thread-thread123', title: 'some title thread', userId: 'user-user456' });
      await CommentThreadsTableTestHelper.addCommentThread({
        id: 'comment-comment123', content: 'some comment thread', userId: 'user-user456', threadId: 'thread-thread123',
      });

      // act
      const response = await server.inject({
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: '/threads/thread-thread123/comments/comment-comment123',
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('akses tidak diberikan');
    });

    it('should response 200 and persist delete comment thread', async () => {
      // arrange
      const server = await createServer(container);
      /** Add user */
      const requestPayloadUser = {
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser,
      });
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password,
        },
      });
      const responseJsonAuth = JSON.parse(responseAuths.payload);
      const { accessToken } = responseJsonAuth.data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some thread title',
          body: 'some body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadJson = JSON.parse(threadResponse.payload);
      const { addedThread } = threadJson.data;

      const commentThreadResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'some comment thread correct' },
        headers: {
          authorization: `Bearer ${accessToken}`, // Add the valid token to the header
        },
      });

      const commentThreadResponseJson = JSON.parse(commentThreadResponse.payload);

      const { addedComment } = commentThreadResponseJson.data;

      // act
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
