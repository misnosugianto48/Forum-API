const AddCommentReplyUseCase = require('../../../../Applications/use_case/AddCommentReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
  }

  async postCommentReplyHandler(request, h) {
    const addCommentReplyUseCase = this._container.getInstance(AddCommentReplyUseCase.name);

    // auth
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    const { commentId } = request.params;

    const addedReply = await addCommentReplyUseCase.execute({
      ...request.payload,
      userId: credentialId,
      threadId,
      commentId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = RepliesHandler;
