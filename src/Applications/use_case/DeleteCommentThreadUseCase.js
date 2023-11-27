/* eslint-disable max-len */
class DeleteCommentThreadUseCase {
  constructor({ threadRepository, commentThreadRepository }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
  }

  async execute(useCasePayload) {
    const { commentId, threadId, userId } = useCasePayload;

    if (!commentId || !userId || !threadId) {
      throw new Error('DELETE_COMMENT_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
    } else if (
      typeof commentId !== 'string' || typeof userId !== 'string' || typeof threadId !== 'string'
    ) {
      throw new Error('DELETE_COMMENT_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    await this._threadRepository.verifyAvailableThread(threadId);

    await this._commentThreadRepository.verifyAvailableCommentThread(commentId);

    await this._commentThreadRepository.verifyCommentThreadOwner(commentId, userId);

    await this._commentThreadRepository.deleteCommentThread(commentId);
  }
}

module.exports = DeleteCommentThreadUseCase;
