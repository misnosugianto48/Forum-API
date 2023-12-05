const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentThreadsTableTestHelper = require('../../../../tests/CommentThreadTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentReplyTableTestHelper = require('../../../../tests/CommentReplyTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  let server;

  beforeEach(async () => {
    server = await createServer(container);
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentThreadsTableTestHelper.cleanTable();
    await CommentReplyTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 when request doesn\'t have auth', async () => {
      // arr
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

      const commentPayload = {
        content: 'some comment thread',
      };

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const commentJson = JSON.parse(responseComment.payload);
      console.log(commentJson);
      const { addedComment } = commentJson.data;

      // act
      const requestPayload = {
        content: 'some comment reply',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: requestPayload,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
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

      const commentPayload = {
        content: 'some comment thread',
      };

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const commentJson = JSON.parse(responseComment.payload);
      console.log(commentJson);
      const { addedComment } = commentJson.data;

      // act
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
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
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
    });
  });

  it('should response 400 when request payload not meet data type specification', async () => {
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

    const commentPayload = {
      content: 'some comment thread',
    };

    const responseComment = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      payload: commentPayload,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const commentJson = JSON.parse(responseComment.payload);
    console.log(commentJson);
    const { addedComment } = commentJson.data;

    // act
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
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
    expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
  });

  it('should response 404 when comment not found', async () => {
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

    // act
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments/comment-fakeid/replies`,
      payload: {
        content: 'some comment reply',
      },
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

  it('should response 201 and persist reply', async () => {
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

    const commentPayload = {
      content: 'some comment thread',
    };

    const responseComment = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments`,
      payload: commentPayload,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const commentJson = JSON.parse(responseComment.payload);
    console.log(commentJson);
    const { addedComment } = commentJson.data;

    // act
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
      payload: {
        content: 'some comment reply',
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    // assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedReply).toBeDefined();
  });
});
