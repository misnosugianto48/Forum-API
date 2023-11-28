const GetCommentThread = require('../GetCommentThread');

describe('a GetCommentThread entities', () => {
  it('should throw error when did not contain needed property', () => {
    // arrange
    const payload = {
      id: 'comment-comment123',
      username: 'misno48',
      date: new Date('2023-11-27 19:00:19.000000'),
    };

    // act and assert
    expect(() => new GetCommentThread(payload)).toThrowError('GET_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when did not meet data type specification', () => {
    // arr
    const payload = {
      id: 123,
      username: 'misno48',
      threadId: 'thread-thread123',
      content: 'some comment thread',
      date: new Date('2023-11-27 19:00:19.000000'),
      isDelete: false,
    };

    // act and assert
    expect(() => new GetCommentThread(payload)).toThrowError('GET_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should getCommentThread object correctly', () => {
    // arr
    const payload = {
      id: 'comment-comment123',
      username: 'misno48',
      threadId: 'thread-thread123',
      content: 'some comment thread',
      date: new Date('2023-11-27 19:00:19.000000'),
      isDelete: false,
    };

    // act
    const getComment = new GetCommentThread(payload);

    // assert
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date.toISOString());
    expect(getComment.content).toEqual(payload.content);
  });

  it('should getCommentThread object correctly when comment has been delete', () => {
    // arr
    const payload = {
      id: 'comment-comment123',
      username: 'misno48',
      threadId: 'thread-thread123',
      content: 'some comment thread',
      date: new Date('2023-11-27 19:00:19.000000'),
      isDelete: true,
    };

    // act
    const getComment = new GetCommentThread(payload);

    // assert
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date.toISOString());
    expect(getComment.content).toEqual('**komentar telah dihapus**');
  });
});
