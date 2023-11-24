const AddCommentThreadUseCase = require('../../../../Applications/use_case/AddCommentThreadUseCase');
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentThreadHandler = this.postCommentThreadHandler.bind(this);
  }

  async postCommentThreadHandler(request, h) {
    try {
      const addCommentThreadUseCase = this._container.getInstance(AddCommentThreadUseCase.name);

      // const { id: credentialId } = request.auth.credentials;

      const { threadId } = request.params;

      const addedComment = await addCommentThreadUseCase.execute({
        ...request.payload,
        // userId: credentialId,
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
    } catch (error) {
      const translatedError = DomainErrorTranslator.translate(error);

      const response = h.response({
        status: 'fail',
        message: translatedError.message,
      });
      response.code(translatedError.statusCode);
      return response;
    }
  }
}

module.exports = CommentsHandler;
