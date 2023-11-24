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

  async function getAccessToken() {
    const server = await createServer(container);

    /** user payload */
    const requestPayloaduser = {
      username: 'misno48',
      password: 'secret_password',
      fullname: 'Misno Sugianto',
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayloaduser,
    });

    /** login payload and create token */
    const authUser = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: requestPayloaduser.username,
        password: requestPayloaduser.password,
      },
    });
    const responseAuth = JSON.parse(authUser.payload);
    const { accessToken } = responseAuth.data;

    return accessToken;
  }

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when request doesn\'t have auth', async () => {
      // arrange
      const server = await createServer(container);

      const authToken = await getAccessToken();
      const threadPayload = {
        title: 'some title thread',
        body: 'some body thread',
      };

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          authorization: `Bearer ${authToken}`,
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

      const authToken = await getAccessToken();

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-idFake/comments',
        payload: {
          content: 'some comment thread',
        },
        headers: {
          authorization: `Bearer ${authToken}`,
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

      const authToken = await getAccessToken();

      const threadPayload = {
        title: 'some title thread',
        body: 'some body thread',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          authorization: `Bearer ${authToken}`,
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
          authorization: `Bearer ${authToken}`,
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

      const authToken = await getAccessToken();

      const threadPayload = {
        title: 'some title thread',
        body: 'some body thread',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          authorization: `Bearer ${authToken}`,
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
          authorization: `Bearer ${authToken}`,
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
      const accessToken = await getAccessToken(server);
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
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);

      console.log(`thread ${thread.payload}`);
      console.log(`response ${response.payload}`);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      // expect(responseJson.data.addedComment).toBeDefined();
    });
  });
});
