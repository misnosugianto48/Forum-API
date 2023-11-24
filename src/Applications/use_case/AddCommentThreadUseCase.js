const AddCommentThread = require('../../Domains/comments/entities/AddCommentThread');

class AddCommentThreadUseCase {
  constructor({ threadRepository, commentThreadRepository }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddCommentThread(useCasePayload);
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
    return this._commentThreadRepository.addCommentThread(addComment);
  }
}

module.exports = AddCommentThreadUseCase;
