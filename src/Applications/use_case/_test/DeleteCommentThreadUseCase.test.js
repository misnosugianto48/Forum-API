/* eslint-disable max-len */
const DeleteCommentThreadUseCase = require('../DeleteCommentThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentThreadRepository = require('../../../Domains/comments/CommentThreadRepository');
const CommentThreadTableTestHelper = require('../../../../tests/CommentThreadTableTestHelper');

describe('deleteCommentThread fucntion', () => {
  it('should throw error when payload not contain needed thread and comment id', async () => {
    const useCasePaylaod = {};
    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({});

    await expect(deleteCommentThreadUseCase.execute(useCasePaylaod)).rejects.toThrowError('DELETE_COMMENT_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
  });

  it('should throw error when payload not string', async () => {
    const useCasePaylaod = {
      threadId: 'thread-thread123',
      commentId: 123,
      userId: 'user-user123',
    };

    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({});

    await expect(deleteCommentThreadUseCase.execute(useCasePaylaod)).rejects.toThrowError('DELETE_COMMENT_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestracting delete correctly', async () => {
    const useCasePaylaod = {
      threadId: 'thread-thread123',
      userId: 'user-user123',
      commentId: 'comment-comment132',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRespository = new CommentThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());

    mockCommentThreadRespository.verifyAvailableCommentThread = jest.fn(() => Promise.resolve());

    mockCommentThreadRespository.verifyCommentThreadOwner = jest.fn(() => Promise.resolve());

    mockCommentThreadRespository.deleteCommentThread = jest.fn(() => Promise.resolve());

    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRespository,
    });

    await deleteCommentThreadUseCase.execute(useCasePaylaod);

    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePaylaod.threadId);

    expect(mockCommentThreadRespository.verifyAvailableCommentThread).toHaveBeenCalledWith(useCasePaylaod.commentId);

    expect(mockCommentThreadRespository.verifyCommentThreadOwner).toHaveBeenCalledWith(useCasePaylaod.commentId, useCasePaylaod.userId);

    expect(mockCommentThreadRespository.deleteCommentThread).toHaveBeenCalledWith(useCasePaylaod.commentId);

    expect(deleteCommentThreadUseCase.execute).toBeDefined();
  });
});
