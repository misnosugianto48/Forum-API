/* eslint-disable max-len */
class DeleteCommentThreadUseCase {
  constructor({ threadRepository, commentThreadRepository }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);

    await this._commentThreadRepository.verifyAvailableCommentThread(useCasePayload.commentId);

    await this._commentThreadRepository.verifyCommentThreadOwner(useCasePayload.commentId, useCasePayload.userId);

    await this._commentThreadRepository.deleteCommentThread(useCasePayload.commentId);
  }

  _verifyPayload(payload) {
    const { commentId, userId, threadId } = payload;

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
