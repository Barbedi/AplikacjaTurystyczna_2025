import db from "../db";
import { Err, FavoriteTrails } from "../Types";

async function addFavouriteTrail(userId: number, trailId: number) {
  const query = `
    INSERT INTO favorite_trails (user_id, trail_id, added_at)
    VALUES ($1, $2, NOW())
    RETURNING *
  `;

  const result = await db.query(query, [userId, trailId]);

  if (result.rowCount === 0) {
    throw new Err("Failed to add favorite trail", 500);
  }

  return result.rows[0] as FavoriteTrails;
}
async function getFavouriteTrails(userId: number) {
  const query = `
    SELECT ft.user_id, ft.trail_id, ft.added_at, t.name AS trail_name
    FROM favorite_trails ft
    JOIN trails t ON ft.trail_id = t.id
    WHERE ft.user_id = $1
  `;

  const result = await db.query(query, [userId]);

  if (result.rowCount === 0) {
    throw new Err("No favorite trails found", 404);
  }

  return result.rows as FavoriteTrails[];
}
async function removeFavouriteTrail(userId: number, trailId: number) {
  const query = `
    DELETE FROM favorite_trails
    WHERE user_id = $1 AND trail_id = $2
    RETURNING *
  `;

  const result = await db.query(query, [userId, trailId]);
  if (result.rowCount === 0) {
    throw new Err(
      "Failed to remove favorite trail or trail not in favorites",
      404,
    );
  }
  return result.rows[0] as FavoriteTrails;
}
export default {
  addFavouriteTrail,
  getFavouriteTrails,
  removeFavouriteTrail,
};
