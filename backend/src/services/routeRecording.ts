import db from "../db";
import { Err } from "../Types";

class RouteRecordingService {
  /** --------------------------------------------------
   *  GET: All routes for a user
   * -------------------------------------------------- */
  async getRoutesByUser(userId: number) {
    const query = `
      SELECT id, user_id, name, created_at, finished_at,
             distance as distance_m, 
             EXTRACT(EPOCH FROM (finished_at - created_at)) * 1000 as duration_ms,
             elevation_gain, elevation_loss,
             0 as max_speed, 
             0 as avg_speed
      FROM routes
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await db.query(query, [userId]);
    return {
      message: "Successfully fetched user routes",
      data: result.rows,
    };
  }

  /** --------------------------------------------------
   *  GET: Route details by ID (including points)
   * -------------------------------------------------- */
  async getRouteById(routeId: number) {
    const routeQuery = `
      SELECT id, user_id, name, created_at, finished_at,
             distance as distance_m, 
             EXTRACT(EPOCH FROM (finished_at - created_at)) * 1000 as duration_ms,
             elevation_gain, elevation_loss,
             0 as max_speed, 
             0 as avg_speed
      FROM routes
      WHERE id = $1
    `;

    const routeResult = await db.query(routeQuery, [routeId]);
    if (routeResult.rows.length === 0) {
      throw new Err("Route not found", 404);
    }

    const route = routeResult.rows[0];

    const pointsQuery = `
      SELECT id, route_id, ts, 
             ST_Y(geom::geometry) as lat, 
             ST_X(geom::geometry) as lon, 
             altitude,
             ST_AsGeoJSON(geom) AS geometry
      FROM route_points
      WHERE route_id = $1
      ORDER BY ts ASC
    `;

    const pointsResult = await db.query(pointsQuery, [routeId]);
    const points = pointsResult.rows.map((p) => ({
      ...p,
      geometry: p.geometry ? JSON.parse(p.geometry) : null,
    }));

    return {
      message: "Successfully fetched route",
      data: {
        ...route,
        points,
      },
    };
  }

  /** --------------------------------------------------
   *  DELETE: Remove route + its points
   * -------------------------------------------------- */
  async deleteRoute(routeId: number, userId: number) {
    // Verify access
    const check = await db.query(
      `SELECT id FROM routes WHERE id = $1 AND user_id = $2`,
      [routeId, userId]
    );

    if (check.rows.length === 0) {
      throw new Err("Route not found or permission denied", 403);
    }

    // Delete points first
    await db.query(
      `DELETE FROM route_points WHERE route_id = $1`,
      [routeId]
    );

    // Delete main route
    await db.query(
      `DELETE FROM routes WHERE id = $1`,
      [routeId]
    );

    return { message: "Route deleted successfully" };
  }
}

export default new RouteRecordingService();
