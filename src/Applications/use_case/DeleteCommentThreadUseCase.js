/* eslint-disable max-len */
class DeleteCommentThreadUseCase {
  constructor({ threadRepository, commentThreadRepository }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);

    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);

    // await this._commentThreadRepository.verifyAvailableCommentThread(commentId);

    await this._commentThreadRepository.verifyCommentThreadOwner(useCasePayload);

    await this._commentThreadRepository.deleteCommentThread(useCasePayload.commentId);
  }

  _validatePayload(payload) {
    const { commentId, threadId, userId } = payload;

    if (!commentId || !userId || !threadId) {
      throw new Error('DELETE_COMMENT_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof commentId !== 'string' || typeof userId !== 'string' || typeof threadId !== 'string'
    ) {
      throw new Error('DELETE_COMMENT_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentThreadUseCase;
