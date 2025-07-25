import db from "../db";
import { Err, CommentShared } from "../Types";

async function getCommentsBySharedTrailId(sharedTrailId: number) {
  const query = `
    SELECT 
      cs.id,
      cs.shared_trail_id,
      cs.user_id,
      cs.content,
      cs.parent_id,
      cs.created_at,
      u.id AS user_id,
      u.name AS user_name,
      u.profile_image AS user_profile_image
    FROM shared_trail_comments cs
    JOIN users u ON cs.user_id = u.id
    WHERE cs.shared_trail_id = $1
    ORDER BY cs.created_at DESC;
  `;

  const result = await db.query(query, [sharedTrailId]);

  if (result.rowCount === 0) {
    throw new Err("No comments found for this shared trail", 404);
  }

  return result.rows.map((row) => ({
    id: row.id,
    shared_trail_id: row.shared_trail_id,
    user_id: row.user_id,
    content: row.content,
    parent_id: row.parent_id,
    created_at: row.created_at,
    user: {
      id: row.user_id,
      name: row.user_name,
      profile_image: row.user_profile_image,
    },
  })) as CommentShared[];
}

async function addComment(comment: CommentShared) {
  const query = `
    WITH new_comment AS (
      INSERT INTO shared_trail_comments (shared_trail_id, user_id, content, parent_id, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    )
    SELECT 
      nc.id,
      nc.shared_trail_id,
      nc.user_id,
      nc.content,
      nc.parent_id,
      nc.created_at,
      u.id AS user_id,
      u.name AS user_name,
      u.profile_image AS user_profile_image
    FROM new_comment nc
    JOIN users u ON nc.user_id = u.id;
  `;

  const values = [
    comment.shared_trail_id,
    comment.user_id,
    comment.content,
    comment.parent_id || null,
  ];

  const result = await db.query(query, values);

  if (result.rowCount === 0) {
    throw new Err("Failed to add comment", 500);
  }

  const row = result.rows[0];
  return {
    id: row.id,
    shared_trail_id: row.shared_trail_id,
    user_id: row.user_id,
    content: row.content,
    parent_id: row.parent_id,
    created_at: row.created_at,
    user: {
      id: row.user_id,
      name: row.user_name,
      profile_image: row.user_profile_image,
    },
  } as CommentShared;
}

async function deleteComment(commentId: number) {
  const query = `
    DELETE FROM comments_shared
    WHERE id = $1
    RETURNING *;
  `;
  const result = await db.query(query, [commentId]);
  if (result.rowCount === 0) {
    throw new Err("Comment not found or already deleted", 404);
  }
  return result.rows[0] as CommentShared;
}

export default {
  getCommentsBySharedTrailId,
  addComment,
  deleteComment,
};
