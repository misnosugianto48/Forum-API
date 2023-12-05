const AddReplyComment = require('../AddReplyComment');

describe('a AddReplyComment entities', () => {
  it('should throw error when paylaod did not contain needed property', () => {
    // arr
    const payload = {
      content: 'some reply comment',
      // commentId
      // threadId
      // userId
    };

    // act and assert
    expect(() => new AddReplyComment(payload)).toThrowError('ADD_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arr
    const payload = {
      content: 'some reply comment',
      commentId: 213,
      threadId: 'thread-thread123',
      userId: 123,
    };

    // act and assert
    expect(() => new AddReplyComment(payload)).toThrowError('ADD_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create replyComment object correctly', () => {
    // arr
    const payload = {
      content: 'some reply comment',
      commentId: 'comment-comment123',
      threadId: 'thread-thread123',
      userId: 'user-user123',
    };

    // act
    const {
      content, commentId, threadId, userId,
    } = new AddReplyComment(payload);

    // assert
    expect(content).toEqual(payload.content);
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(userId).toEqual(payload.userId);
  });
});
