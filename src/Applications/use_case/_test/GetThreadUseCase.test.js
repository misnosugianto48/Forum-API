/* eslint-disable max-len */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentThreadRepository = require('../../../Domains/comments/CommentThreadRepository');
const GetCommentThread = require('../../../Domains/comments/entities/GetCommentThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const getThreadUseCase = new GetThreadUseCase({});

    // act and assert
    await expect(getThreadUseCase.execute('')).rejects.toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    const getThreadUseCase = new GetThreadUseCase({});

    // act and assert
    await expect(getThreadUseCase.execute(123)).rejects.toThrowError('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestracting get thread correctly', async () => {
    const expectedGetThread = {
      id: 'thread-thread123',
      title: 'some title thread',
      body: 'some body thread',
      date: new Date('2023-11-27 19:00:00.000000'),
      username: 'misno48',
      comments: [
        new GetCommentThread(
          {
            id: 'comment-comment123',
            username: 'misno48',
            date: new Date('2023-11-28 20:05:12.312967'),
            content: 'some comment thread',
            isDelete: false,
          },
        ),
      ],
    };

    /** createing dependancy of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-thread123',
      title: 'some title thread',
      body: 'some body thread',
      date: new Date('2023-11-27 19:00:00.000000'),
      username: 'misno48',
    }));

    mockCommentThreadRepository.getCommentThread = jest.fn().mockImplementation(() => Promise.resolve([
      {
        id: 'comment-comment123',
        username: 'misno48',
        date: new Date('2023-11-28 20:05:12.312967'),
        content: 'some comment thread',
        isDelete: false,
      },
    ]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRepository,
    });

    // act
    const thread = await getThreadUseCase.execute('thread-thread123');

    // assert
    expect(thread).toStrictEqual(expectedGetThread);
    expect(mockThreadRepository.getThread).toHaveBeenCalledWith('thread-thread123');
    expect(mockCommentThreadRepository.getCommentThread).toHaveBeenCalledWith('thread-thread123');
  });
});
