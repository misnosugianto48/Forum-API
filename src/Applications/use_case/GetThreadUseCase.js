const GetCommentThread = require('../../Domains/comments/entities/GetCommentThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentThreadRepository, commentReplyRepository }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(threadId) {
    this._validatePayload(threadId);
    const thread = await this._threadRepository.getThread(threadId);
    const commentData = await this._commentThreadRepository.getCommentThread(threadId);

    return {
      ...thread,
      comments: commentData.map((data) => new GetCommentThread({
        id: data.id,
        username: data.username,
        date: data.date,
        content: data.content,
        is_delete: data.is_delete,
      })),
    };
  }

  _validatePayload(threadId) {
    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadUseCase;
