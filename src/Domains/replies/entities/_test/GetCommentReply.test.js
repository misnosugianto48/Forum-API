const GetCommentReply = require('../GetCommentReplay');

describe('getCommentReply entities', () => {
  it('should throw error when payload did not contain property needed', () => {
    // crr
    const payload = {
      id: 'reply-reply123',
      username: 'misno48',
      date: new Date('2023-11-28 19:00:19.000000'),
      // content
      // is_delete
    };

    // act and assert
    expect(() => new GetCommentReply(payload)).toThrowError('GET_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply',
      username: 'misno48',
      date: 'date',
      content: 'some comment reply',
      is_delete: 123,
    };

    // act and assert
    expect(() => new GetCommentReply(payload)).toThrowError('GET_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return GetCommentReply object correctly when replies after deleting', () => {
    // arr
    const payload = {
      id: 'reply-reply123',
      content: 'some comment reply',
      date: new Date('2023-11-28 19:00:00.000000'),
      username: 'misno48',
      is_delete: true,
    };

    // act
    const replies = new GetCommentReply(payload);

    // assert
    expect(replies.id).toEqual(payload.id);
    expect(replies.content).toEqual('**balasan telah dihapus**');
    expect(replies.date).toEqual(payload.date.toISOString());
    expect(replies.username).toEqual(payload.username);
  });

  it('should return GetCommentReply object correctly', () => {
    // arr
    const payload = {
      id: 'reply-reply123',
      content: 'some comment reply',
      date: new Date('2023-11-28 19:00:00.000000'),
      username: 'misno48',
      is_delete: false,
    };

    // act
    const replies = new GetCommentReply(payload);

    // assert
    expect(replies.id).toEqual(payload.id);
    expect(replies.content).toEqual(payload.content);
    expect(replies.date).toEqual(payload.date.toISOString());
    expect(replies.username).toEqual(payload.username);
  });
});
