const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, userId } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, user_id',
      values: [id, title, body, userId, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedThread({
      ...result.rows[0],
      owner: result.rows[0].user_id,
    });
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount !== 1) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThread(threadId) {
    const query = {
      text: `
        SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username 
        FROM threads
        JOIN users ON users.id = threads.user_id 
        WHERE threads.id = $1
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    } else {
      return result.rows[0];
    }
  }
}
module.exports = ThreadRepositoryPostgres;
