import db from "../db";
import { Err } from "../Types";
import helper from "../helper";

async function getUserActivities(userId: number, page = 1, limit = 6) {
  if (page < 1 || limit < 1) {
    throw new Err("Invalid page or limit", 400);
  }

  if (!userId) {
    throw new Err("User ID is required", 400);
  }
  const offset = helper.getOffset(page, limit);
  const query = `
      SELECT id, user_id, action_type, target_id, target_name, created_at
      FROM "user_activities"
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
  const result = await db.query(query, [userId, limit, offset]);
  const countQuery = `
        SELECT COUNT(*) FROM "user_activities" WHERE user_id = $1
        `;
  const countResult = await db.query(countQuery, [userId]);
  const totalCount = parseInt(countResult.rows[0].count, 10);
  const totalPages = Math.ceil(totalCount / limit);
  return {
    data: result.rows,
    message: `Successfully fetched activities for user ${userId}`,
    totalPages,
    page,
    limit,
  };
}

export default {
  getUserActivities,
};
