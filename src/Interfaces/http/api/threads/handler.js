const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    // auth
    const { id: credentialId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      userId: credentialId,
    });

    // console.log(addedThread);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);

    const { threadId } = request.params;

    console.log(threadId);

    const thread = await getThreadUseCase.execute(threadId);

    console.log(thread);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });

    console.log(response);
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
