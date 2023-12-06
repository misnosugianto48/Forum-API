/* eslint-disable max-len */
const CommentReplyTableTestHelper = require('../../../../tests/CommentReplyTableTestHelper');
const CommentThreadTableTestHelper = require('../../../../tests/CommentThreadTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const CommentReplyRepositoryPostgres = require('../CommentReplyRepositoryPostgres');
const AddedReplyComment = require('../../../Domains/replies/entities/AddedReplyComment');

describe('CommentReplyRepositoryPostgres', () => {
  let commentReplyRepositoryPostgres;

  beforeEach(() => {
    // arr
    commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentThreadTableTestHelper.cleanTable();
    await CommentReplyTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableCommentReply function', () => {
    it('should throw NotFoundError when reply not available', async () => {
      // act and assert
      await expect(commentReplyRepositoryPostgres.verifyAvailableCommentReply('reply-reply123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply available', async () => {
      // act
      await UsersTableTestHelper.addUser({
        id: 'user-user123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-thread123',
        userId: 'user-user123',
      });

      await CommentThreadTableTestHelper.addCommentThread({
        id: 'comment-comment123',
        userId: 'user-user123',
        threadId: 'thread-thread123',
      });

      await CommentReplyTableTestHelper.addCommentReply({
        id: 'reply-reply123',
        commentId: 'comment-comment123',
        threadId: 'thread-thread123',
        userId: 'user-user123',
      });

      // assert
      await expect(commentReplyRepositoryPostgres.verifyAvailableCommentReply('reply-reply123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentReplyOwner function', () => {
    it('should throw AuthorizationError when users can\'t access reply', async () => {
      // act
      await UsersTableTestHelper.addUser({
        id: 'user-user123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-thread123',
        userId: 'user-user123',
      });

      await CommentThreadTableTestHelper.addCommentThread({
        id: 'comment-comment123',
        userId: 'user-user123',
        threadId: 'thread-thread123',
      });

      await CommentReplyTableTestHelper.addCommentReply({
        id: 'reply-reply123',
        commentId: 'comment-comment123',
        threadId: 'thread-thread123',
        userId: 'user-user123',
      });

      // assert
      await expect(commentReplyRepositoryPostgres.verifyCommentReplyOwner('reply-reply123', 'user-user13')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when users can access reply', async () => {
      // act
      await UsersTableTestHelper.addUser({
        id: 'user-user123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-thread123',
        userId: 'user-user123',
      });

      await CommentThreadTableTestHelper.addCommentThread({
        id: 'comment-comment123',
        userId: 'user-user123',
        threadId: 'thread-thread123',
      });

      await CommentReplyTableTestHelper.addCommentReply({
        id: 'reply-reply123',
        commentId: 'comment-comment123',
        threadId: 'thread-thread123',
        userId: 'user-user123',
      });

      // assert
      await expect(commentReplyRepositoryPostgres.verifyCommentReplyOwner('reply-reply123', 'user-user123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('addCommentReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // arr
      const fakeIdGenerator = () => 'reply123';
      const customCommentReplyRepository = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({
        id: 'user-user123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-thread123',
        userId: 'user-user123',
      });

      await CommentThreadTableTestHelper.addCommentThread({
        id: 'comment-comment123',
        userId: 'user-user123',
        threadId: 'thread-thread123',
      });

      const addReply = {
        content: 'some comment reply',
        commentId: 'comment-comment123',
        threadId: 'thread-thread123',
        userId: 'user-user123',
      };

      // act
      const addedReply = await customCommentReplyRepository.addReplyComment(addReply);

      // assert
      expect(addedReply).toStrictEqual(new AddedReplyComment({
        id: 'reply-reply123',
        content: 'some comment reply',
        owner: 'user-user123',
      }));

      const replies = await CommentReplyTableTestHelper.findCommentReplyById('reply-reply123');
      expect(replies).toHaveLength(1);
      expect(replies).toEqual(expect.any(Array));
    });
  });

  describe('getCommentReply function', () => {
    it('should get reply correctly', async () => {
      // arr
      await UsersTableTestHelper.addUser({
        id: 'user-user123',
        username: 'misno48',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-thread123',
        userId: 'user-user123',
      });

      await CommentThreadTableTestHelper.addCommentThread({
        id: 'comment-comment123',
        userId: 'user-user123',
        threadId: 'thread-thread123',
      });

      await CommentReplyTableTestHelper.addCommentReply({
        commentId: 'comment-comment123',
        threadId: 'thread-thread123',
        userId: 'user-user123',
      });

      // act
      const replies = await commentReplyRepositoryPostgres.getCommentReply('thread-thread123');
      console.log(replies);

      // assert
      expect(Array.isArray(replies)).toBe(true);
    });
  });
});
