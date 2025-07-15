import db from "../db";
import {Err, Trails } from "../Types";
import helper from "../helper";

class TrailsService {
  // Pobierz wszystkie trasy
  async getAllTrails(): Promise<Trails[]> {
    const result = await db.query(
      "SELECT * FROM trails ORDER BY created_at DESC",
    );
    return result.rows;
  }

  // Pobierz trasę po ID
  async getTrailById(id: number): Promise<Trails | null> {
    const result = await db.query("SELECT * FROM trails WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  async getTrailsByUser(
    userId: string,
    page=1,
    limit=7
  ) {
    if (page < 1 || limit < 1) {
      throw new Err("Invalid page or limit", 400);
    }
    const offset= helper.getOffset(page, limit);
    const query = `
      SELECT * FROM trails
      WHERE created_by = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await db.query(query, [userId, limit, offset]);
    
    const countQuery = `
      SELECT COUNT(*) FROM trails WHERE created_by = $1
    `;
    const countResult = await db.query(countQuery, [userId]);
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limit);
    return {
      data: result.rows,
      message: `Successfully fetched trails for user ${userId}`,
      totalPages,
      page,
      limit,
    };
  }

  // Utwórz nową trasę
  async createTrail(trail: Omit<Trails, "id" | "created_at">): Promise<Trails> {
    const {
      name,
      description,
      difficulty,
      length_km,
      elevation_gain,
      region,
      route_type,
      geometry,
      created_by,
    } = trail;

    const result = await db.query(
      `INSERT INTO trails 
       (name, description, difficulty, length_km, elevation_gain, region, route_type, geometry, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,ST_GeomFromGeoJSON($8),$9)
       RETURNING *`,
      [
        name,
        description,
        difficulty,
        length_km,
        elevation_gain,
        region,
        route_type,
        JSON.stringify(geometry),
        created_by,
      ],
    );

    return result.rows[0];
  }

  async updateTrail(
    id: number,
    trail: Partial<Omit<Trails, "id" | "created_at">>,
  ): Promise<Trails | null> {
    const {
      name,
      description,
      difficulty,
      length_km,
      elevation_gain,
      region,
      route_type,
      geometry,
      created_by,
    } = trail;

    const result = await db.query(
      `UPDATE trails SET
         name = COALESCE($2, name),
         description = COALESCE($3, description),
         difficulty = COALESCE($4, difficulty),
         length_km = COALESCE($5, length_km),
         elevation_gain = COALESCE($6, elevation_gain),
         region = COALESCE($7, region),
         route_type = COALESCE($8, route_type),
         geometry = COALESCE(ST_GeomFromGeoJSON($9), geometry),
         created_by = COALESCE($10, created_by)
       WHERE id = $1
       RETURNING *`,
      [
        id,
        name,
        description,
        difficulty,
        length_km,
        elevation_gain,
        region,
        route_type,
        geometry ? JSON.stringify(geometry) : null,
        created_by,
      ],
    );

    return result.rows[0] || null;
  }

  // Usuń trasę
  async deleteTrail(id: number): Promise<void> {
    await db.query("DELETE FROM trails WHERE id = $1", [id]);
  }
}

export default new TrailsService();
