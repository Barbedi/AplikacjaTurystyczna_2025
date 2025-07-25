import db from "../db";
import helper from "../helper";
import { Err,Review } from "../Types";

async function getAllReviews(){
    const query = `
        SELECT 
      r.id,
      r.user_id,
      r.comment,
      r.rating,
      r.created_at,
      p.name AS peak_name,
      t.name AS trail_name
    FROM reviews r
    LEFT JOIN peaks p ON r.peak_id = p.id
    LEFT JOIN trails t ON r.trail_id = t.id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC;
    `;
    const result = await db.query(query);
    return result.rows as Review[];

}
async function getReviewByUserId(userId: number,page = 1, limit = 6) {
    if (page < 1 || limit < 1) {
      throw new Err("Invalid page or limit", 400);
    }
     const offset = helper.getOffset(page, limit);
    const query = `
        SELECT 
      r.id,
      r.user_id,
      r.comment,
      r.rating,
      r.created_at,
      p.name AS peak_name,
      t.name AS trail_name
    FROM reviews r
    LEFT JOIN peaks p ON r.peak_id = p.id
    LEFT JOIN trails t ON r.trail_id = t.id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
    `;
    const result = await db.query(query, [userId, limit, offset]);
    if (result.rowCount === 0) {
        throw new Err("No reviews found for this user", 404);
    }
    const countQuery = `
      SELECT COUNT(*) FROM reviews WHERE user_id = $1
    `;
    const countResult = await db.query(countQuery, [userId]);
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limit);
    return {
       data: result.rows as Review[],
       message: `Successfully fetched reviews for user ${userId}`,
       totalPages,
       page,
       limit,
    };
}

async function createReview(data: Review) {
    if (!data.trail_id && !data.peak_id) {
        throw new Err("Either trail_id or peak_id is required", 400);
    }

    const query = `
        INSERT INTO reviews (user_id, trail_id, peak_id, comment, rating, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
    `;
    const result = await db.query(query, [
        data.user_id,
        data.trail_id || null,
        data.peak_id || null,
        data.comment,
        data.rating
    ]);
    if (result.rowCount === 0) {
        throw new Err("Failed to create review", 500);
    }
    return result.rows[0] as Review;
}
async function deleteReview(id: number) {
    const query = `
        DELETE FROM reviews
        WHERE id = $1
        RETURNING *
    `;
    const result = await db.query(query, [id]);
    if (result.rowCount === 0) {
        throw new Err("Failed to delete review or review not found", 404);
    }
    return result.rows[0] as Review;
}

export default {
    getAllReviews,
    getReviewByUserId,
    createReview,
    deleteReview
};
    
