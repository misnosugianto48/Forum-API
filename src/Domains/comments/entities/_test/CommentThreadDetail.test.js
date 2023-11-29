const CommentThreadDetail = require('../CommentThreadDetail');

describe('a CommentThreadDetail entity', () => {
  it('should throw error when paylaod did not contain needed property', () => {
    // arr
    const paylaod = {
      id: 'comment-comment123',
      username: 'misno48',
      date: '2023-11-28',
    };

    // act and assert
    expect(() => new CommentThreadDetail(paylaod)).toThrowError('GET_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // arr
    const payload = {
      id: 1234,
      username: 'misno48',
      date: '2023-11-28',
      content: 'some comment thread',
      isDelete: true,
    };

    // act and assert
    expect(() => new CommentThreadDetail(payload)).toThrowError('GET_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return CommentThreadDetail object correctly', () => {
    // arr
    const payload = {
      id: 'comment-comment123',
      username: 'misno48',
      date: '2023-11-28',
      content: 'some comment thread',
      isDelete: false,
    };

    // act
    const getCommentThread = new CommentThreadDetail(payload);

    // assert
    expect(getCommentThread.id).toEqual(payload.id);
    expect(getCommentThread.username).toEqual(payload.username);
    expect(getCommentThread.date).toEqual(new Date(payload.date).toISOString());
    expect(getCommentThread.content).toEqual(payload.content);
  });

  it('should return CommentThreadDetail object correctly after deleting', () => {
    // arr
    const payload = {
      id: 'comment-comment123',
      username: 'misno48',
      date: '2023-11-28',
      content: 'some comment thread',
      isDelete: true,
    };

    // act
    const getCommentThread = new CommentThreadDetail(payload);

    // assert
    expect(getCommentThread.id).toEqual(payload.id);
    expect(getCommentThread.username).toEqual(payload.username);
    expect(getCommentThread.date).toEqual(new Date(payload.date).toISOString());
    expect(getCommentThread.content).toEqual('**komentar telah dihapus**');
  });
});
