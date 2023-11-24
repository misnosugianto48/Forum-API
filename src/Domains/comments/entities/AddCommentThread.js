class AddCommentThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('ADD_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentThread;
