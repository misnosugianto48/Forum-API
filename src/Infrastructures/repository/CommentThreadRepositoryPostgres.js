const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentThreadRepository = require('../../Domains/comments/CommentThreadRepository');
const AddedCommentThread = require('../../Domains/comments/entities/AddedCommentThread');

class CommentThreadRepositoryPostgres extends CommentThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentThread(addComment) {
    const { content, threadId, userId } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5 ,$6) RETURNING id, content, user_id',
      values: [id, content, userId, threadId, isDelete, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedCommentThread({
      ...result.rows[0],
      owner: result.rows[0].user_id,
    });
  }

  async verifyAvailableCommentThread(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount !== 1) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentThreadOwner(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount !== 1) {
      throw new AuthorizationError('akses tidak diberikan');
    }
  }

  async deleteCommentThread(commentId) {
    const isDelete = true;
    const deletedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE comments SET is_delete = $2, deleted_at = $3 WHERE id = $1',
      values: [commentId, isDelete, deletedAt],
    };
    await this._pool.query(query);
  }

  async getCommentThread(threadId) {
    const query = {
      text: `SELECT comments.id, comments.thread_id, users.username, comments.created_at AS date, comments.content, comments.is_delete 
      FROM comments 
      LEFT JOIN threads ON threads.id = comments.thread_id 
      LEFT JOIN users ON users.id = comments.user_id
      WHERE comments.thread_id = $1 
      ORDER BY comments.created_at 
      ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = CommentThreadRepositoryPostgres;
