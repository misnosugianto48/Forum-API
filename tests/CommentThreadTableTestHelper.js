/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentThreadTableTestHelper = {
  async addCommentThread({
    id = 'comment-comment123',
    content = 'some comment thread',
    userId = 'user-user123',
    threadId = 'thread-123thread',
  }) {
    const createdAt = new Date().toISOString();
    const isDelete = false;
    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, content, userId, threadId, isDelete, createdAt],
    };

    await pool.query(query);
  },

  async findCommentThreadsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteCommentThread(id) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE comments SET is_delete = $2, deleted_at = $3 WHERE id = $1',
      values: [id, true, deletedAt],
    };

    return pool.query(query);
  },

  async findDeletedComment(id) {
    const query = {
      text: 'SELECT is_delete FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    const isDelete = result.rows[0].is_delete;
    return isDelete;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentThreadTableTestHelper;
