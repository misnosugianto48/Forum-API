class AddReplyComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      content, commentId, threadId, userId,
    } = payload;

    this.content = content;
    this.commentId = commentId;
    this.threadId = threadId;
    this.userId = userId;
  }

  _verifyPayload({
    content, commentId, threadId, userId,
  }) {
    if (!content || !commentId || !threadId || !userId) {
      throw new Error('ADD_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string'
      || typeof commentId !== 'string'
      || typeof threadId !== 'string'
      || typeof userId !== 'string'
    ) {
      throw new Error('ADD_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReplyComment;
