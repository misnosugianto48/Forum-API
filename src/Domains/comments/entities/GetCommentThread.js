class GetCommentThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, username, date, content,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = new Date(date).toISOString();
    this.content = content;
  }

  _verifyPayload({
    id, username, date, content,
  }) {
    if (!id || !username || !date || !content) {
      throw new Error('GET_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string') {
      throw new Error('GET_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetCommentThread;
