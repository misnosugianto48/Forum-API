const CommentReplyRepository = require('../../Domains/replies/CommentReplyRepository');
const AddedReplyComment = require('../../Domains/replies/entities/AddedReplyComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplyComment(newReply) {
    const {
      content, commentId, threadId, userId,
    } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO comment_replies VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, user_id',
      values: [id, content, commentId, threadId, userId, isDelete, createdAt],
    };

    const result = await await this._pool.query(query);

    return new AddedReplyComment({
      ...result.rows[0],
      owner: result.rows[0].user_id,
    });
  }

  async verifyAvailableCommentReply(replyId) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount !== 1) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyCommentReplyOwner(replyId, userId) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1 AND user_id = $2',
      values: [replyId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount !== 1) {
      throw new AuthorizationError('akses tidak diberikan');
    }
  }
}

module.exports = CommentReplyRepositoryPostgres;
