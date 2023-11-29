const GetCommentThread = require('../../Domains/comments/entities/CommentThreadDetail');

class GetThreadUseCase {
  constructor({ threadRepository, commentThreadRepository }) {
    this._threadRepository = threadRepository;
    this._commentThreadRespository = commentThreadRepository;
  }

  async execute(threadId) {
    this._validatePayload(threadId);

    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentThreadRespository.getCommentThread(threadId);

    const result = {
      ...thread,
      comments: comments.map((comment) => new GetCommentThread(comment)),
    };

    console.log(result);

    return result;
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
