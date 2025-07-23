import db from "../db";
import { Err, CommunityTrails } from "../Types";


async function createCommunityTrail(userId: number, trailId: number, description: string) {
  const query = `
    INSERT INTO shared_trails (user_id, trail_id, description, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *
  `;

  const result = await db.query(query, [userId, trailId, description]);

  if (result.rowCount === 0) {
    throw new Err("Failed to create community trail", 500);
  }

  return result.rows[0] as CommunityTrails;
}

async function getCommunityTrailsBySharedId(sharedId: number) {
  const query = `
    SELECT st.id AS shared_id, st.description AS shared_description,
           st.created_at,
           t.id AS trail_id,
           t.name AS trail_name,
           t.description AS trail_description,
           u.id AS user_id,
           u.name AS user_name
    FROM shared_trails st
    JOIN trails t ON st.trail_id = t.id
    JOIN users u ON st.user_id = u.id
    WHERE st.id = $1;
  `;
  const result = await db.query(query, [sharedId]);
  if (result.rowCount === 0) {
    throw new Err("Community trail not found", 404);
  }
  return result.rows[0] as CommunityTrails;
}


async function getCommunityTrails() {
    const query = `
     SELECT st.id AS shared_id, st.description AS shared_description,
        st.created_at,
         t.id AS trail_id,
         t.name AS trail_name,
         t.description AS trail_description,
         u.id AS user_id,
         u.name AS user_name
         FROM shared_trails st
         JOIN trails t ON st.trail_id = t.id
         JOIN users u ON st.user_id = u.id
        ORDER BY st.created_at DESC;
    `;

  const result = await db.query(query);
    if (result.rowCount === 0) {
      throw new Err("Failed to get community trails", 500);
    }
  return result.rows as CommunityTrails[];
}
export default {
  createCommunityTrail,
  getCommunityTrails,
  getCommunityTrailsBySharedId,
};