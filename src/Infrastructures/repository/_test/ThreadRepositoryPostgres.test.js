const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      /** create user for owner value in thread */
      const registerUser = new RegisterUser({
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      });

      const fakeIdGeneratorUser = () => 'user123'; // stub!

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGeneratorUser);

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      /** create add with owner value from user */
      const addThread = {
        title: 'some title thread',
        body: 'some body thread',
        userId: registeredUser.id,
      };

      const fakeIdGeneratorThread = () => 'thread123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGeneratorThread);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-thread123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      /** added user for owner value in thread */
      const registerUser = new RegisterUser({
        username: 'misno48',
        password: 'secret_password',
        fullname: 'Misno Sugianto',
      });

      const fakeIdGeneratorUser = () => 'user123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGeneratorUser);
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      /** added thread with owner value from user */
      const addThread = new AddThread({
        title: 'some title thread',
        body: 'some body thread',
        userId: registeredUser.id,
      });

      const fakeIdGeneratorThread = () => 'thread123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGeneratorThread);

      // action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-thread123',
        title: 'some title thread',
        owner: 'user-user123',
      }));
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-thread123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when threads available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      await UsersTableTestHelper.addUser({
        id: 'user-user123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-thread123',
        userId: 'user-user123',
      });

      // Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-thread123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
