/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // constraint threads
  pgm.addConstraint(
    'threads',
    'fk_threads.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );

  // constraint comments
  pgm.addConstraint(
    'comments',
    'fk_comments.user_id_users.id',
    'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'comments',
    'fk_comments.thread_id_threads.id',
    'FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  );

  // constraint comment replies
  pgm.addConstraint(
    'comment_replies',
    'fk_comment_replies.thread_id_threads.id',
    'FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'comment_replies',
    'fk_comment_replies.comment_id_comments.id',
    'FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'comment_replies',
    'fk_comment_replies.user_id_users.id',
    'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = pgm => {
  pgm.dropConstraint('threads', 'fk_threads.user_id_users.id');
  pgm.dropConstraint('comments', 'fk_comments.user_id_users.id');
  pgm.dropConstraint('comments', 'fk_comments.thread_id_threads.id');
  pgm.dropConstraint('comment_replies', 'fk_comment_replies.thread_id_threads.id');
  pgm.dropConstraint('comment_replies', 'fk_comment_replies.comment_id_comments.id');
  pgm.dropConstraint('comment_replies', 'fk_comment_replies.user_id_users.id');
};
