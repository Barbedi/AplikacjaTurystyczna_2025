import db from "../db";

class TrailPointsService {
  async addPointsForTrail(
    trailId: number,
    points: { lat: number; lng: number; name?: string; point_order: number }[],
  ) {
    const values = points.map(
      (p) =>
        `(${trailId}, ${p.lat}, ${p.lng}, ${p.name ? `'${p.name}'` : "NULL"}, ${p.point_order})`,
    );
    const query = `
      INSERT INTO trail_points (trail_id, lat, lng, name, point_order)
      VALUES ${values.join(",")}
    `;
    await db.query(query);
  }

  async getPointsByTrailId(trailId: number) {
    const result = await db.query(
      "SELECT * FROM trail_points WHERE trail_id = $1 ORDER BY point_order ASC",
      [trailId],
    );
    return result.rows;
  }

  async deletePointsByTrailId(trailId: number) {
    await db.query("DELETE FROM trail_points WHERE trail_id = $1", [trailId]);
  }
}

export default new TrailPointsService();
