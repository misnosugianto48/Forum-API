/* eslint-disable max-len */
const AddCommentReply = require('../../../Domains/replies/entities/AddReplyComment');
const AddedCommentReply = require('../../../Domains/replies/entities/AddedReplyComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentThreadRepository = require('../../../Domains/comments/CommentThreadRepository');
const CommentReplyRepository = require('../../../Domains/replies/CommentReplyRepository');
const AddCommentReplyUseCase = require('../AddCommentReplyUseCase');

describe('AddCommentReplyuseCase', () => {
  it('should orchestracting the add reply action correctly', async () => {
    // arr
    const owner = {
      id: 'user-user123',
      username: 'misno48',
    };

    const thread = {
      id: 'thread-thread123',
      title: 'some title thread',
    };

    const comment = {
      id: 'comment-comment123',
      content: 'some comment thread',
    };

    const useCasePayload = {
      content: 'some reply comment',
      commentId: comment.id,
      threadId: thread.id,
      userId: owner.id,
    };

    const mockAddedCommentReply = new AddedCommentReply({
      id: 'reply-reply123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    /** creating dependancy of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());

    mockCommentThreadRepository.verifyAvailableCommentThread = jest.fn().mockImplementation(() => Promise.resolve());

    mockCommentReplyRepository.addReplyComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddedCommentReply));

    /** creating use case instances */
    const getComentReplyUseCase = new AddCommentReplyUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      commentThreadRepository: mockCommentThreadRepository,
      threadRepository: mockThreadRepository,
    });

    // act
    const addedCommentReply = await getComentReplyUseCase.execute(useCasePayload);

    // assert
    expect(addedCommentReply).toStrictEqual(new AddedCommentReply({
      id: 'reply-reply123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    }));

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);

    expect(mockCommentThreadRepository.verifyAvailableCommentThread).toBeCalledWith(useCasePayload.commentId);

    expect(mockCommentReplyRepository.addReplyComment).toBeCalledWith(new AddCommentReply(useCasePayload));
  });
});
