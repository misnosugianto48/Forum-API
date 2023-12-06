const CommentReplyRepository = require('../CommentReplyRepository');

describe('CommentReplyRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    // arr
    const commentReplyRepository = new CommentReplyRepository();

    // act and assert
    await expect(commentReplyRepository.addReplyComment({})).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(commentReplyRepository.verifyAvailableReplyComment('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(commentReplyRepository.verifyCommentReplyOwner('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(commentReplyRepository.getCommentReply('')).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
