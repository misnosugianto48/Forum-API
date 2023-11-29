const AddCommentThreadUseCase = require('../../../../Applications/use_case/AddCommentThreadUseCase');
const DeleteCommentThreadUseCase = require('../../../../Applications/use_case/DeleteCommentThreadUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentThreadHandler = this.postCommentThreadHandler.bind(this);
    this.deleteCommentThreadHandler = this.deleteCommentThreadHandler.bind(this);
  }

  async postCommentThreadHandler(request, h) {
    const addCommentThreadUseCase = this._container.getInstance(AddCommentThreadUseCase.name);

    // auth
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;

    const addedComment = await addCommentThreadUseCase.execute({
      ...request.payload,
      userId: credentialId,
      threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentThreadHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentThreadUseCase.name);
    const payload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      userId: request.auth.credentials.id,
    };

    await deleteCommentUseCase.execute(payload);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
