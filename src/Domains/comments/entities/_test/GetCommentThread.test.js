const GetCommentThread = require('../GetCommentThread');

describe('a GetCommentThread entities', () => {
  it('should throw error when did not containe needed property', () => {
    // arrange
    const payload = {
      id: 'comment-comment123',
      username: 'misno48',
      date: '2023-11-27',
    };

    // act and assert
    expect(() => new GetCommentThread(payload)).toThrowError('GET_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when did not meet data type specification', () => {
    // arr
    const payload = {
      id: 1234,
      username: 'misno48',
      date: '2023-11-27',
      content: 'some comment thread',
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
      date: '2023-11-27',
      content: 'some comment thread',
      isDelete: false,
    };

    // act
    const getComment = new GetCommentThread(payload);

    // assert
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(new Date(payload.date).toISOString());
    expect(getComment.content).toEqual(payload.content);
  });

  it('should getCommentThread object correctly when comment has been delete', () => {
    // arr
    const payload = {
      id: 'comment-comment123',
      username: 'misno48',
      date: '2023-11-27',
      content: '**komentar telah dihapus**',
      isDelete: true,
    };

    // act
    const getComment = new GetCommentThread(payload);

    // assert
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(new Date(payload.date).toISOString());
    expect(getComment.content).toEqual('**komentar telah dihapus**');
  });
});
