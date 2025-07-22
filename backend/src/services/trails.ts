import db from "../db";
import { Err, Trails } from "../Types";
import helper from "../helper";
import TrailPointsService from "./trailsPoint";

class TrailsService {
  // Pobierz wszystkie trasy
  async getAllTrails(): Promise<Trails[]> {
    const result = await db.query(
      "SELECT *, ST_AsGeoJSON(geometry) as geometry FROM trails ORDER BY created_at DESC",
    );
    return result.rows.map((row) => ({
      ...row,
      geometry: row.geometry ? JSON.parse(row.geometry) : null,
    }));
  }
  async getTrailsByPublic(page = 1, limit = 7) {
    if (page < 1 || limit < 1) {
      throw new Err("Invalid page or limit", 400);
    }
    const offset = helper.getOffset(page, limit);

    const query = `
      SELECT *, ST_AsGeoJSON(geometry) as geometry FROM trails 
      WHERE is_public = true 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await db.query(query, [limit, offset]);

    const countQuery = `
      SELECT COUNT(*) FROM trails WHERE is_public = true
    `;
    const countResult = await db.query(countQuery);
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limit);

    const trails = result.rows.map((row) => ({
      ...row,
      geometry: row.geometry ? JSON.parse(row.geometry) : null,
    }));

    return {
      data: trails,
      message: "Successfully fetched public trails",
      totalPages,
      page,
      limit,
    };
  }

  async getRandomPublicTrails(limit = 3): Promise<Trails[]> {
    const query = `
      SELECT *, ST_AsGeoJSON(geometry) as geometry FROM trails 
      WHERE is_public = true 
      ORDER BY RANDOM()
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);

    return result.rows.map((row) => ({
      ...row,
      geometry: row.geometry ? JSON.parse(row.geometry) : null,
    }));
  }

  async getTrailById(id: number): Promise<Trails | null> {
    const result = await db.query(
      "SELECT *, ST_AsGeoJSON(geometry) as geometry FROM trails WHERE id = $1",
      [id],
    );
    if (result.rows[0]) {
      const row = result.rows[0];
      const points = await TrailPointsService.getPointsByTrailId(id);
      const photos = await this.getTrailPhotos(id);

      return {
        ...row,
        geometry: row.geometry ? JSON.parse(row.geometry) : null,
        points: points || [],
        photos: photos || [],
      };
    }
    return null;
  }

  async getTrailsByRegion(region: string, page = 1, limit = 6) {
    if (page < 1 || limit < 1) {
      throw new Err("Invalid page or limit", 400);
    }
    const offset = helper.getOffset(page, limit);
    const query = `
      SELECT *, ST_AsGeoJSON(geometry) as geometry FROM trails
      WHERE region = $1 and is_public = true
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await db.query(query, [region, limit, offset]);
    const countQuery = `
      SELECT COUNT(*) FROM trails WHERE region = $1 and is_public = true
    `;
    const countResult = await db.query(countQuery, [region]);
     const totalCount = parseInt(countResult.rows[0].count);
     const totalPages = Math.ceil(totalCount / limit);
      const trails = result.rows.map((row) => ({
      ...row,
      geometry: row.geometry ? JSON.parse(row.geometry) : null,
    }));
    return {
      data: trails,
      message: `Successfully fetched trails for region ${region}`,
      totalPages,
      page,
      limit,
    };
  }

  async getTrailsByUser(userId: string, page = 1, limit = 7) {
    if (page < 1 || limit < 1) {
      throw new Err("Invalid page or limit", 400);
    }
    const offset = helper.getOffset(page, limit);
    const query = `
      SELECT *, ST_AsGeoJSON(geometry) as geometry FROM trails
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

    const trails = result.rows.map((row) => ({
      ...row,
      geometry: row.geometry ? JSON.parse(row.geometry) : null,
    }));

    return {
      data: trails,
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
      duration_minutes,
    } = trail;

    const result = await db.query(
      `INSERT INTO trails 
       (name, description, difficulty, length_km, elevation_gain, region, route_type, geometry, created_by, duration_minutes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,ST_GeomFromGeoJSON($8),$9,$10)
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
        duration_minutes,
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
      duration_minutes,
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
         created_by = COALESCE($10, created_by),
         duration_minutes = COALESCE($11, duration_minutes)
       WHERE id = $1
       RETURNING *, ST_AsGeoJSON(geometry) as geometry`,
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
        duration_minutes,
      ],
    );

    if (result.rows[0]) {
      const row = result.rows[0];
      const points = await TrailPointsService.getPointsByTrailId(id);

      return {
        ...row,
        geometry: row.geometry ? JSON.parse(row.geometry) : null,
        points: points || [],
      };
    }
    return null;
  }

  // Usuń trasę
  async deleteTrail(id: number): Promise<void> {
    await db.query("DELETE FROM trails WHERE id = $1", [id]);
  }

  // Usuń zdjęcie trasy
  async deleteTrailPhoto(id: number, photoName: string): Promise<void> {
    const result = await db.query(
      "DELETE FROM photos WHERE trail_id = $1 AND image_name = $2 RETURNING *",
      [id, photoName],
    );
    if (result.rowCount === 0) {
      throw new Err("Photo not found", 404);
    }
  }
  // Update trail photos
  async updateTrailPhotos(
    trailId: number,
    photos: { image_name: string; created_at: string }[],
  ) {

    const trailCheck = await db.query("SELECT id FROM trails WHERE id = $1", [
      trailId,
    ]);
    if (trailCheck.rowCount === 0) {
      throw new Err("Trail not found", 404);
    }
    const insertPromises = photos.map(async (photo) => {
      const result = await db.query(
        "INSERT INTO photos (trail_id, image_name, created_at) VALUES ($1, $2, $3) RETURNING *",
        [trailId, photo.image_name, photo.created_at],
      );
      return result.rows[0];
    });
    const insertedPhotos = await Promise.all(insertPromises);
    return insertedPhotos;
  }

  // Get photos for a trail
  async getTrailPhotos(trailId: number) {
    const result = await db.query("SELECT * FROM photos WHERE trail_id = $1", [
      trailId,
    ]);
    return result.rows;
  }
}

export default new TrailsService();
