/* eslint-disable max-len */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentThreadRepository = require('../../../Domains/comments/CommentThreadRepository');
const GetCommentThread = require('../../../Domains/comments/entities/CommentThreadDetail');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // arr
    const getThreadUseCase = new GetThreadUseCase({});

    // act and assert
    await expect(getThreadUseCase.execute('')).rejects.toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // arr
    const getThreadUseCase = new GetThreadUseCase({});

    // act and assert
    await expect(getThreadUseCase.execute(123)).rejects.toThrowError('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestracting get thread correctly', async () => {
    // arr
    const expectGetThread = {
      id: 'thread-thread123',
      title: 'some title thread',
      body: 'some body thread',
      date: '2023-11-28',
      username: 'misno48',
      comments: [
        new GetCommentThread(
          {
            id: 'comment-comment123',
            username: 'misno48',
            date: '2023-11-28',
            content: 'some comment thread',
            isDelete: false,
          },
        ),
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();

    mockThreadRepository.getThread = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-thread123',
      title: 'some title thread',
      body: 'some body thread',
      date: '2023-11-28',
      username: 'misno48',
    }));

    mockCommentThreadRepository.getCommentThread = jest.fn().mockImplementation(() => Promise.resolve([{
      id: 'comment-comment123',
      username: 'misno48',
      date: '2023-11-28',
      content: 'some comment thread',
      isDelete: false,
    },
    ]));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRepository,
    });

    // act
    const threads = await getThreadUseCase.execute('thread-thread123');

    // assert
    expect(threads).toStrictEqual(expectGetThread);
    expect(mockThreadRepository.getThread).toHaveBeenCalledWith('thread-thread123');
    expect(mockCommentThreadRepository.getCommentThread).toHaveBeenCalledWith('thread-thread123');
  });
});
