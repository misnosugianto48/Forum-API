class GetCommentReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, is_delete: isDelete,
    } = payload;

    this.id = id;
    this.content = (isDelete) ? '**balasan telah dihapus**' : content;
    this.date = date.toISOString();
    this.username = username;
  }

  _verifyPayload(payload) {
    const {
      id, content, date, username, is_delete: isDelete,
    } = payload;

    if (!id || !content || !date || !username) {
      throw new Error('GET_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || !(date instanceof Date) || typeof username !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('GET_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetCommentReply;
