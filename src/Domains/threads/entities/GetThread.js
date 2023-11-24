class GetThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      title,
      body,
      date,
      username,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = new Date(date).toISOString();
    this.username = username;
  }

  _verifyPayload({
    id, title, body, date, username,
  }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof date !== 'string' || typeof username !== 'string'
    ) {
      throw new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThread;
