/* eslint-disable max-len */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentThreadRepository = require('../../../Domains/comments/CommentThreadRepository');
const GetCommentThread = require('../../../Domains/comments/entities/GetCommentThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should throw error when payload did not contain property needed', async () => {
    // arr
    const threadId = '';
    const getThreadUseCase = new GetThreadUseCase({});

    // act and assert
    await expect(getThreadUseCase.execute(threadId)).rejects.toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // arr
    const threadId = 123;
    const getThreadUseCase = new GetThreadUseCase({});

    // act and assert
    await expect(getThreadUseCase.execute(threadId)).rejects.toThrowError('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestracting get thread correctly', async () => {
    const threadId = 'thread-thread123';
    const expectGetThreads = {
      id: 'thread-thread123',
      title: 'some title thread',
      body: 'some body thread',
      date: '2021-08-08T07:22:33.555Z',
      username: 'misno48',
      comments: [
        new GetCommentThread(
          {
            id: 'comment-comment123',
            username: 'misno48',
            date: '2021-08-08T07:22:33.555Z',
            content: 'some comment thread',
            isDelete: false,
          },
        ),
      ],
    };

    /** creating dependancy of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-thread123',
      title: 'some title thread',
      body: 'some body thread',
      date: '2021-08-08T07:22:33.555Z',
      username: 'misno48',
    }));

    mockCommentThreadRepository.getCommentThread = jest.fn().mockImplementation(() => Promise.resolve([
      {
        id: 'comment-comment123',
        username: 'misno48',
        date: '2021-08-08T07:22:33.555Z',
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
    const threads = await getThreadUseCase.execute(threadId);

    expect(threads).toStrictEqual(expectGetThreads);
    expect(mockThreadRepository.getThread).toHaveBeenCalledWith(threadId);

    expect(mockCommentThreadRepository.getCommentThread).toHaveBeenCalledWith(threadId);
  });
});
