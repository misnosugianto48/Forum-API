const GetCommentThread = require('../../Domains/comments/entities/GetCommentThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentThreadRepository }) {
    this._threadRepository = threadRepository;
    this._commentThreadRespository = commentThreadRepository;
  }

  async execute(threadId) {
    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    } else if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const thread = await this._threadRepository.getThread(threadId);

    const commentThread = await this._commentThreadRespository.getCommentThread(threadId);

    const comment = commentThread.map((data) => new GetCommentThread({
      id: data.id,
      username: data.username,
      date: data.date,
      content: data.content,
      isDelete: data.isDelete,
    }));

    return {
      ...thread,
      comments: comment,
    };
  }
}

module.exports = GetThreadUseCase;
