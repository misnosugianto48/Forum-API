const AddedReplyComment = require('../AddedReplyComment');

describe('a AddedReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arr
    const payload = {
      // id: 'reply-reply123',
      content: 'some reply comment',
      owner: 'user-user123',
    };

    // act and assert
    expect(() => new AddedReplyComment(payload)).toThrowError('ADDED_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // arr
    const payload = {
      id: 'reply-reply123',
      content: 123,
      owner: 'user-user123',
    };

    // act and assert
    expect(() => new AddedReplyComment(payload)).toThrowError('ADDED_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedReplyComment object correctly', () => {
    // arr
    const payload = {
      id: 'reply-reply123',
      content: 'some reply comment',
      owner: 'user-user123',
    };

    //
    const addedReplyComment = new AddedReplyComment(payload);

    // /assert
    expect(addedReplyComment.id).toEqual(payload.id);
    expect(addedReplyComment.content).toEqual(payload.content);
    expect(addedReplyComment.owner).toEqual(payload.owner);
  });
});
