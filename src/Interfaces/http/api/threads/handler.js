const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    try {
      const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

      // auth
      const { id: credentialId } = request.auth.credentials;
      const addedThread = await addThreadUseCase.execute({
        ...request.payload,
        userId: credentialId,
      });

      const response = h.response({
        status: 'success',
        data: {
          addedThread,
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

module.exports = ThreadsHandler;
