const GetCommentThread = require('../GetCommentThread');

describe('GetCommentThread entitiy', () => {
  it('should throw error when payload did not contain property needed', () => {
    const payload = {
      id: 'comment-comment123',
      username: 'misno48',
      date: new Date('2023-11-28 19:00:19.000000'),
    };

    expect(() => new GetCommentThread(payload)).toThrowError('GET_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'COMMENT',
      username: 212,
      date: '0301199809876',
      content: 'HELPPP',
      is_delete: 12455,
    };

    expect(() => new GetCommentThread(payload)).toThrowError('GET_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return GetCommentThread object correctly when comment is deleted', () => {
    const payload = {
      id: 'comment-comment123',
      username: 'misno48',
      date: new Date('2023-11-28 19:00:00.000000'),
      content: 'HELPPPP',
      is_delete: false,
    };

    const comments = new GetCommentThread(payload);

    expect(comments.id).toEqual(payload.id);
    expect(comments.username).toEqual(payload.username);
    expect(comments.date).toEqual(payload.date.toISOString());
    expect(comments.content).toEqual(payload.content);
  });

  it('should return GetCommentThread object correctly', () => {
    const payload = {
      id: 'comment-comment123',
      username: 'misno48',
      date: new Date('2023-11-28 19:00:00.000000'),
      content: 'HELPPPP',
      is_delete: true,
    };

    const comments = new GetCommentThread(payload);

    expect(comments.id).toEqual(payload.id);
    expect(comments.username).toEqual(payload.username);
    expect(comments.date).toEqual(payload.date.toISOString());
    expect(comments.content).toEqual('**komentar telah dihapus**');
  });
});
