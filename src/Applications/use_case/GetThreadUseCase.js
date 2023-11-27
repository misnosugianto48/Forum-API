const GetCommentThread = require('../../Domains/comments/entities/GetCommentThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentThreadRepository }) {
    this._threadRepository = threadRepository;
    this._commentThreadRespository = commentThreadRepository;
  }

  async execute(useCasePayload) {
    const threadId = useCasePayload;

    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
    } else if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const threads = await this._threadRepository.getThread(threadId);
    const commentThreads = await this._commentThreadRespository.getCommentThread(threadId);

    const comment = commentThreads.map((data) => new GetCommentThread({
      id: data.id,
      username: data.username,
      date: data.date,
      content: data.content,
      isDelete: data.isDelete,
    }));

    return {
      ...threads,
      comments: comment,
    };
  }
}

module.exports = GetThreadUseCase;
