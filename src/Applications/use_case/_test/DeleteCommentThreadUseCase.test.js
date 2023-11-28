/* eslint-disable max-len */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentThreadRepository = require('../../../Domains/comments/CommentThreadRepository');
const DeleteCommentThreadUseCase = require('../DeleteCommentThreadUseCase');

describe('DeleteCommentThreadUseCase', () => {
  it('should throw error if payload not contain needed property', async () => {
    // arr
    const useCasePayload = {
      threadId: 'thread-thread123',
      commentId: 'comment-thread123',
    };

    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({});

    // act and assert
    await expect(deleteCommentThreadUseCase.execute(useCasePayload))
      .rejects.toThrowError('DELETE_COMMENT_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not string', async () => {
    // arrange
    const useCasePayload = {
      commentId: 123,
      userId: 'user-user123',
      threadId: 'thread-thread123',
    };
    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({});

    // action and assert
    await expect(deleteCommentThreadUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestracting delete comment thread correctly', async () => {
    // arrange
    const useCasePayload = {
      commentId: 'comment-comment123',
      userId: 'user-user123',
      threadId: 'thread-thread123',
    };

    /** createing dependancy of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());

    // mockCommentThreadRepository.verifyAvailableCommentThread = jest.fn(() => Promise.resolve());

    mockCommentThreadRepository.verifyCommentThreadOwner = jest.fn(() => Promise.resolve());

    mockCommentThreadRepository.deleteCommentThread = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({
      commentThreadRepository: mockCommentThreadRepository,
      threadRepository: mockThreadRepository,
    });

    // action
    await deleteCommentThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.threadId);

    // expect(mockCommentThreadRepository.verifyAvailableCommentThread).toHaveBeenCalledWith(useCasePayload.commentId);

    expect(mockCommentThreadRepository.verifyCommentThreadOwner).toHaveBeenCalledWith(useCasePayload);

    expect(mockCommentThreadRepository.deleteCommentThread).toHaveBeenCalledWith(useCasePayload.commentId);

    expect(mockCommentThreadRepository.deleteCommentThread).toBeDefined();
  });
});
