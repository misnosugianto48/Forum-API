class CommentThreadRepository {
  async addCommentThread(addComment) {
    throw new Error('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableCommentThread(commentId) {
    throw new Error('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentThreadOwner(commentId, userId) {
    throw new Error('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentThread(commentId) {
    throw new Error('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentThread(threadId) {
    throw new Error('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentThreadRepository;
