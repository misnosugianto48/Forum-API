/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentReplyTableTestHelper = {
  async addCommentReply({
    id = 'reply-reply123',
    content = 'some reply comment',
    commentId = 'comment-comment123',
    threadId = 'thread-123thread',
    userId = 'user-user123',
  }) {
    const createdAt = new Date().toISOString();
    const isDelete = false;
    const query = {
      text: 'INSERT INTO comment_replies VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, commentId, threadId, userId, isDelete, createdAt],
    };
    // id | content | comment_id | thread_id | user_id | is_delete | created_at | deleted_at
    await pool.query(query);
  },

  async findCommentReplyById(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteCommentReply(id) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE comment_replies SET is_delete = $2, deleted_at = $3 WHERE id = $1',
      values: [id, true, deletedAt],
    };

    return pool.query(query);
  },

  async findDeletedReply(id) {
    const query = {
      text: 'SELECT is_delete FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    const isDelete = result.rows[0].is_delete;
    return isDelete;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_replies WHERE 1=1');
  },
};

module.exports = CommentReplyTableTestHelper;
