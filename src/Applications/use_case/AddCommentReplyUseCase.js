const AddCommentReply = require('../../Domains/replies/entities/AddReplyComment');

class AddCommentReplyUseCase {
  constructor({ threadRepository, commentThreadRepository, commentReplyRepository }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddCommentReply(useCasePayload);
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
    await this._commentThreadRepository.verifyAvailableCommentThread(useCasePayload.commentId);
    return this._commentReplyRepository.addReplyComment(addReply);
  }
}

module.exports = AddCommentReplyUseCase;
