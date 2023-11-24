const CommentThreadRepository = require('../CommentThreadRepository');

describe('CommentThreadRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    // Arrange
    const commentThreadRepository = new CommentThreadRepository();

    // Action and assert
    await expect(commentThreadRepository.addCommentThread({})).rejects.toThrowError('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(commentThreadRepository.verifyAvailableCommentThread('')).rejects.toThrowError('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(commentThreadRepository.verifyCommentThreadOwner({})).rejects.toThrowError('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
