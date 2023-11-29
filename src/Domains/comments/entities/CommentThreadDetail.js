class GetCommentThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = new Date(payload.date).toISOString();
    this.content = (payload.isDelete) ? '**komentar telah dihapus**' : payload.content;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, isDelete,
    } = payload;

    if (!id || !username || !date || !content) {
      throw new Error('GET_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('GET_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetCommentThread;
