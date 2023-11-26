const AddCommentThreadUseCase = require('../../../../Applications/use_case/AddCommentThreadUseCase');
const DeleteCommentThreadUseCase = require('../../../../Applications/use_case/DeleteCommentThreadUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentThreadHandler = this.postCommentThreadHandler.bind(this);
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

  async deleteCommentThreadHandler(request, h) {
    const deleteCommentThreadUseCase = this._container.getInstance(DeleteCommentThreadUseCase.name);

    // auth
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    const { commentId } = request.params;
    const useCasePayload = {
      threadId,
      commentId,
      credentialId,
    };
    await deleteCommentThreadUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentsHandler;
