/* eslint-disable max-len */
const AddCommentThread = require('../../../Domains/comments/entities/AddCommentThread');
const AddedCommentThread = require('../../../Domains/comments/entities/AddedCommentThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentThreadRepository = require('../../../Domains/comments/CommentThreadRepository');
const AddCommentThreadUseCase = require('../AddCommentThreadUseCase');

describe('AddCommentThreadUseCase', () => {
  it('should orchestracting the add comment action correctly', async () => {
    // Arrange
    const owner = {
      id: 'user-user123',
      username: 'misno48',
    };

    const thread = {
      id: 'thread-thread123',
      title: 'some title thread',
    };

    const useCasePayload = {
      content: 'some comment thread',
      userId: owner.id,
      threadId: thread.id,
    };

    const mockAddedCommentThread = new AddedCommentThread({
      id: 'comment-comment123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    /** createing dependancy of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());

    mockCommentThreadRepository.addCommentThread = jest.fn().mockImplementation(() => Promise.resolve(mockAddedCommentThread));

    /** creating use case instance */
    const getCommentThreadUseCase = new AddCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRepository,
    });

    // Action
    const addedCommentThread = await getCommentThreadUseCase.execute(useCasePayload);

    // assert
    expect(addedCommentThread).toStrictEqual(new AddedCommentThread({
      id: 'comment-comment123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    }));

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);

    expect(mockCommentThreadRepository.addCommentThread).toBeCalledWith(new AddCommentThread({
      content: useCasePayload.content,
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
    }));
  });
});
