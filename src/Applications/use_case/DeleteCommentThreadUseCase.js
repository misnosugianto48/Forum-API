/* eslint-disable max-len */
class DeleteCommentThreadUseCase {
  constructor({ threadRepository, commentThreadRepository }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);

    const { threadId, commentId, userId } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);

    await this._commentThreadRepository.verifyAvailableCommentThread(commentId);

    await this._commentThreadRepository.verifyCommentThreadOwner(commentId, userId);

    await this._commentThreadRepository.deleteCommentThread(useCasePayload.commentId);
  }

  _validatePayload(payload) {
    const { commentId, threadId, userId } = payload;

    if (!commentId || !userId || !threadId) {
      throw new Error('DELETE_COMMENT_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
    }

    if (
      typeof commentId !== 'string' || typeof userId !== 'string' || typeof threadId !== 'string'
    ) {
      throw new Error('DELETE_COMMENT_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentThreadUseCase;
