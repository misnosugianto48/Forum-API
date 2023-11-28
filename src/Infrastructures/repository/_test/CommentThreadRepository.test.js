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
        /** create user for owner value in thread */
        await UsersTableTestHelper.addUser({ id: 'user-user123', username: 'misno48' });

        /** create thread for id value in comment */
        await ThreadsTableTestHelper.addThread({ title: 'some title' });

        /** create comment thread with value from owner and thread */
        await CommentThreadsTableTestHelper.addCommentThread({ content: 'some comment thread' });

        const useCasePayload = {
          threadId: 'thread-thread123',
          userId: 'user-user123',
          commentId: 'comment-comment123',
        };

        // action
        const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

        // await expect(commentThreadRepositoryPostgres.verifyCommentThreadOwner(useCasePayload)).resolves.not.toThrowError(AuthorizationError);

        await commentThreadRepositoryPostgres.deleteCommentThread('comment-comment123');

        // assert
        deletedComment = await CommentThreadsTableTestHelper.findCommentThreadsByIdFalseDelete(useCasePayload.commentId);

        // deletedComment = await CommentThreadsTableTestHelper.findCommentThreadsById(useCasePayload.commentId);
        // console.log(deletedComment);
        // expect(deletedComment.is_delete).toEqual(true);
        // expect(deletedComment).toHaveLength(0);
      });

      describe('getCommentThread function', () => {
        it('should throw not found error when comment not found', async () => {
          const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool);

          // act and assert
          await expect(commentThreadRepositoryPostgres.getCommentThread('thread-fake')).rejects.toThrowError(NotFoundError);
        });

        it('should get comment correctly', async () => {
          const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

          const userPayload = {
            id: 'user-user123',
            username: 'misno48',
          };

          await UsersTableTestHelper.addUser(userPayload);

          const threadPayload = {
            id: 'thread-thread123',
            title: 'some title thread',
            userId: userPayload.id,
          };

          await ThreadsTableTestHelper.addThread(threadPayload);

          const commentPayload = {
            content: 'some comment thread',
            userId: userPayload.id,
            threadId: threadPayload.id,
          };

          await CommentThreadsTableTestHelper.addCommentThread(commentPayload);

          const comments = await commentThreadRepositoryPostgres.getCommentThread(threadPayload.id);

          expect(Array.isArray(comments)).toBe(true);
          expect(comments[0].id).toEqual('comment-comment123');
          expect(comments[0].thread_id).toEqual('thread-thread123');
          expect(comments[0].username).toEqual('misno48');
          expect(comments[0].content).toEqual('some comment thread');
          expect(comments[0].is_delete).toBeDefined();
          expect(comments[0].date).toBeDefined();
        });
      });
    });
  });
});
