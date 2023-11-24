const AddedCommentThread = require('../AddedCommentThread');

describe('a AddedCommentThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'some comment thread',
      owner: 'user-user123',
    };

    // Action and assert
    expect(() => new AddedCommentThread(payload)).toThrowError('ADDED_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when did not meet data type specification', () => {
    // arrange
    const payload = {
      id: 'comment-comment123',
      content: 123,
      owner: 'user-user123',
    };

    // Action and asserrt
    expect(() => new AddedCommentThread(payload)).toThrowError('ADDED_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedCommentThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-comment123',
      content: 'some comment thread',
      owner: 'user-user123',
    };

    // action
    const addedCommentThread = new AddedCommentThread(payload);

    // assert
    expect(addedCommentThread.id).toEqual(payload.id);
    expect(addedCommentThread.content).toEqual(payload.content);
    expect(addedCommentThread.owner).toEqual(payload.owner);
  });
});
