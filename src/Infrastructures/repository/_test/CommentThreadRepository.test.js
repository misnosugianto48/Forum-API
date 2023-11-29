/* eslint-disable max-len */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentThreadsTableTestHelper = require('../../../../tests/CommentThreadTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const AddedCommentThread = require('../../../Domains/comments/entities/AddedCommentThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const CommentThreadRepositoryPostgres = require('../CommentThreadRepositoryPostgres');
const CommentThreadTableTestHelper = require('../../../../tests/CommentThreadTableTestHelper');

describe('CommentThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentThread funtion', () => {
    it('should persist add comment thread and return added comment thread correctly', async () => {
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

      /** create thread for id value in comment */
      const addThread = new AddThread({
        title: 'some title thread',
        body: 'some body thread',
        userId: registeredUser.id,
      });

      const fakeIdGeneratorThread = () => 'thread123'; // stub!

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGeneratorThread);

      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      /** create comment thread with value from owner and thread */
      const addCommentThread = {
        content: 'some comment thread',
        userId: registeredUser.id,
        threadId: addedThread.id,
      };

      const fakeIdGeneratorCommentThread = () => 'comment123'; // stub!

      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, fakeIdGeneratorCommentThread);

      // Action
      const addedCommentThread = await commentThreadRepositoryPostgres.addCommentThread(addCommentThread);

      // Assert
      expect(addedCommentThread).toStrictEqual(new AddedCommentThread({
        id: 'comment-comment123',
        content: 'some comment thread',
        owner: 'user-user123',
      }));

      const commentThreads = await CommentThreadsTableTestHelper.findCommentThreadsById('comment-comment123');
      expect(commentThreads).toHaveLength(1);
    });
  });

  describe('verifyAvailableCommentThread function', () => {
    it('should throw NotFoundError when comments not available', async () => {
      // Arrange
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

      // action and assert
      await expect(commentThreadRepositoryPostgres.verifyAvailableCommentThread('comment-comment123')).rejects.toThrowError(NotFoundError);
    });

    it('should not thow NotFoundError when comments available', async () => {
      // Arrange
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

      // Action
      await UsersTableTestHelper.addUser({
        id: 'user-user123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-thread123',
        userId: 'user-user123',
      });

      await CommentThreadsTableTestHelper.addCommentThread({
        id: 'comment-comment123',
        userId: 'user-user123',
        threadId: 'thread-thread123',
      });

      // assert
      await expect(commentThreadRepositoryPostgres.verifyAvailableCommentThread('comment-comment123')).resolves.not.toThrowError(NotFoundError);
    });

    describe('verifyCommentThreadOwner function', () => {
      it('should throw AuthorizationError when users can not access comment', async () => {
        // arrange
        const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

        // action
        await UsersTableTestHelper.addUser({
          id: 'user-user123',
        });

        await ThreadsTableTestHelper.addThread({
          id: 'thread-thread123',
          userId: 'user-user123',
        });

        await CommentThreadsTableTestHelper.addCommentThread({
          id: 'comment-comment123',
          userId: 'user-user123',
          threadId: 'thread-thread123',
        });

        // assert
        await expect(commentThreadRepositoryPostgres.verifyCommentThreadOwner('comment-comment123', 'user-user13')).rejects.toThrowError(AuthorizationError);
      });

      it('should not throw AuthorizationError when users can access comments', async () => {
        // arrange
        const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

        // action
        await UsersTableTestHelper.addUser({
          id: 'user-user123',
        });

        await ThreadsTableTestHelper.addThread({
          id: 'thread-thread123',
          userId: 'user-user123',
        });

        await CommentThreadsTableTestHelper.addCommentThread({
          id: 'comment-comment123',
          userId: 'user-user123',
          threadId: 'thread-thread123',
        });

        // assert
        await expect(commentThreadRepositoryPostgres.verifyCommentThreadOwner('comment-comment123', 'user-user123')).resolves.not.toThrowError(AuthorizationError);
      });
    });

    describe('deleteCommentThread function', () => {
      it('shoud be soft delete comment thread', async () => {
        // Arrange
        const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

        await UsersTableTestHelper.addUser({
          id: 'user-user123',
          username: 'misno48',
        });

        await ThreadsTableTestHelper.addThread({
          id: 'thread-thread123',
          title: 'some title thread',
          userId: 'user-user123',
        });

        await CommentThreadsTableTestHelper.addCommentThread({
          content: 'some comment thread',
          threadId: 'thread-thread123',
          userId: 'user-user123',
        });

        // act
        await commentThreadRepositoryPostgres.deleteCommentThread('comment-comment123');

        // assert
        deletedComment = await CommentThreadsTableTestHelper.findDeletedComment('comment-comment123');

        expect(typeof deletedComment).toEqual('boolean');
      });

      describe('getCommentThread function', () => {
        it('should throw not found error when comment not found', async () => {
          const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool);

          // act and assert
          await expect(commentThreadRepositoryPostgres.getCommentThread('thread-fake')).rejects.toThrowError(NotFoundError);
        });

        it('should get comment correctly', async () => {
          // arr
          // const expectComments = [
          //   {
          //     id: 'comment-comment123',
          //     username: 'misno48',
          //     content: 'some comment thread',
          //     date: new Date('2023-11-28 18:45:40'),
          //     is_delete: false,
          //   },
          // ];

          const userPayload = {
            id: 'user-user123',
            username: 'misno48',
          };

          await UsersTableTestHelper.addUser(userPayload);

          const threadPayload = {
            id: 'thread-thread123',
            title: 'some title thread',
            body: 'some body thread',
            userId: 'user-user123',
          };

          await ThreadsTableTestHelper.addThread(threadPayload);

          // const commentPaylaod = {
          //   content: 'some comment thread',
          //   userId: 'user-user123',
          // };

          await CommentThreadsTableTestHelper.addCommentThread({ userId: 'user-user123', threadId: 'thread-thread123' });

          const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool);

          // act
          const detailCommentThread = await commentThreadRepositoryPostgres.getCommentThread('thread-thread123');

          console.log(detailCommentThread);

          // assert
          expect(Array.isArray(detailCommentThread)).toBe(true);
          expect(detailCommentThread[0].id).toEqual('comment-comment123');
          expect(detailCommentThread[0].thread_id).toEqual('thread-thread123');
          expect(detailCommentThread[0].username).toEqual('misno48');
          expect(detailCommentThread[0].content).toEqual('some comment thread');
          expect(detailCommentThread[0].is_delete).toBeDefined();
          expect(detailCommentThread[0].date).toBeDefined();
        });
      });
    });
  });
});
