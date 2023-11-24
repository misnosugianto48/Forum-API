/* eslint-disable max-len */
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestracting the add thread action correctly', async () => {
    // Arrange
    const owner = {
      id: 'user-user123',
      username: 'misno48',
    };

    const useCasePayload = {
      title: 'some title thread',
      body: 'some body thread',
      userId: owner.id,
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-thread123',
      title: useCasePayload.title,
      owner: useCasePayload.userId,
    });

    /** creating dependancy of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());

    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-thread123',
      title: 'some title thread',
      owner: owner.id,
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: 'some title thread',
      body: 'some body thread',
      userId: useCasePayload.userId,
    }));
  });
});
