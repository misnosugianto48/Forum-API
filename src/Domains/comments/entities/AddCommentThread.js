class AddCommentThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, userId, threadId } = payload;

    this.content = content;
    this.userId = userId;
    this.threadId = threadId;
  }

  _verifyPayload({ content, userId, threadId }) {
    if (!content || !userId || !threadId) {
      throw new Error('ADD_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof userId !== 'string' || typeof threadId !== 'string') {
      throw new Error('ADD_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentThread;
