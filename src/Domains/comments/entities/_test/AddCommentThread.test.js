const AddCommentThread = require('../AddCommentThread');

describe('a AddCommentThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'some comment thread',
    };

    // Action adn Assert
    expect(() => new AddCommentThread(payload)).toThrowError('ADD_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'some comment thread',
      userId: 'user-user123',
      threadId: 1234,
    };

    // Action and Assert
    expect(() => new AddCommentThread(payload)).toThrowError('ADD_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentThread object correctly', () => {
    // Arrange
    const payload = {
      content: 'some content thread',
      userId: 'user-user123',
      threadId: 'thread-thread123',
    };

    // Action
    const { content, userId, threadId } = new AddCommentThread(payload);

    // assert
    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
    expect(threadId).toEqual(payload.threadId);
  });
});
