import db from "../db";
import { Err, TrailLike } from "../Types";

async function likeTrail(userId: number, shared_trail_id: number) {
  if (!userId || !shared_trail_id) {
    throw new Err("User ID and Shared Trail ID are required", 400);
  }

  const query =
    'INSERT INTO "shared_trail_likes" (user_id, shared_trail_id, created_at) VALUES ($1, $2, NOW()) RETURNING *';
  const result = await db.query(query, [userId, shared_trail_id]);

  if (result.rows.length === 0) {
    throw new Err("Failed to like the trail", 500);
  }

  return {
    data: result.rows[0] as TrailLike,
    message: "Trail liked successfully",
  };
}

async function unlikeTrail(userId: number, shared_trail_id: number) {
  if (!userId || !shared_trail_id) {
    throw new Err("User ID and Shared Trail ID are required", 400);
  }

  const query =
    'DELETE FROM "shared_trail_likes" WHERE user_id = $1 AND shared_trail_id = $2 RETURNING *';
  const result = await db.query(query, [userId, shared_trail_id]);

  if (result.rows.length === 0) {
    throw new Err("Failed to unlike the trail or trail not liked", 404);
  }

  return {
    data: result.rows[0] as TrailLike,
    message: "Trail unliked successfully",
  };
}

async function getLikesInfo(sharedTrailId: number, userId: number) {
  const totalLikesResult = await db.query(
    "SELECT COUNT(*) FROM shared_trail_likes WHERE shared_trail_id = $1",
    [sharedTrailId],
  );

  const userLikedResult = await db.query(
    "SELECT 1 FROM shared_trail_likes WHERE shared_trail_id = $1 AND user_id = $2",
    [sharedTrailId, userId],
  );

  return {
    totalLikes: parseInt(totalLikesResult.rows[0].count, 10),
    likedByUser: userLikedResult.rows.length > 0,
  };
}

export default {
  likeTrail,
  unlikeTrail,
  getLikesInfo,
};
