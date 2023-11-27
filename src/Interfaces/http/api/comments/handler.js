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
    const deleteCommentThreadUseCase = this._container.getInstance(DeleteCommentThreadUseCase.name);

    // auth
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    const { commentId } = request.params;
    console.log('user: ', credentialId, 'thread: ', threadId, 'comment: ', commentId);
    const useCasePayload = {
      threadId,
      commentId,
      credentialId,
    };
    await deleteCommentThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
    });

    response.code(200);
  }
}

module.exports = CommentsHandler;
