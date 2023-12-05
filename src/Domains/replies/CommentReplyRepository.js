/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class CommentReplyRepository {
  async addReplyComment(newReply) {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableReplyComment(replyId) {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentReplyOwner(replyId, userId) {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getReplyComment(threadId) {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentReplyRepository;
