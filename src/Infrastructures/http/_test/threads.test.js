const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
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

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(); // Get the valid token
      const requestPayload = {
        title: 'some title',
        body: 'some body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`, // Add the valid token to the header
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201); // Expect status code 201
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      // create user and token
      const authToken = await getAccessToken();

      // thread payload
      const requestPayload = {
        title: 'some title thread',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);

      // create user and token
      const authToken = await getAccessToken();

      // thread payload
      const requestPayload = {
        title: 123,
        body: 'some body thread',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 400 when title more than 50 character', async () => {
      // Arrange
      const server = await createServer(container);

      // create user and token
      const authToken = await getAccessToken();

      // thread payload
      const requestPayload = {
        title: 'some title threadsome title threadsome title threadsome title threadsome title threadsome title threadsome title threadsome title threadsome title threadsome title thread',
        body: 'some body thread',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit');
    });

    it('should response 401 when request doesn\'t have auth', async () => {
      const server = await createServer(container);

      // thread payload
      const requestPayload = {
        title: 'some title thread',
        body: 'some body thread',
      };

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail', async () => {
      const server = await createServer(container);

      const authToken = await getAccessToken();

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'some title thread',
          body: 'some body thread',
        },
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);

      const { addedThread } = threadResponseJson.data;

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      console.log('get :', response);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual('thread-thread123');
      expect(responseJson.data.thread.title).toBeDefined();
      expect(responseJson.data.thread.body).toBeDefined();
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments[0].id).toEqual('comment-comment123');
      expect(responseJson.data.thread.comments[0].username).toBeDefined();
      expect(responseJson.data.thread.comments[0].date).toBeDefined();
    });
  });
});
