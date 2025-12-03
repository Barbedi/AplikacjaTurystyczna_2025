import { Router } from "express";
import db from "../db";

const router = Router();

router.post("/", async (req, res) => {
  const { user_id, name } = req.body;
  console.log(`[Backend] POST /tracking - Creating route for user ${user_id}, name: ${name}`);

  try {
    const result = await db.query(
      `INSERT INTO routes (user_id, name, created_at)
       VALUES ($1, $2, now())
       RETURNING id`,
      [user_id, name]
    );

    console.log(`[Backend] Route created with ID: ${result.rows[0].id}`);
    res.json({ route_id: result.rows[0].id });
  } catch (error) {
    console.error(`[Backend] Error creating route:`, error);
    res.status(500).json({ message: "Failed to create route", error: String(error) });
  }
});

router.post("/:id/point", async (req, res) => {
  const { lat, lon, altitude, ts } = req.body;
  const { id } = req.params;

  console.log(`[Backend] POST /tracking/${id}/point - Point:`, { lat, lon, altitude, ts });

  try {
    await db.query(
      `INSERT INTO route_points (route_id, altitude, ts, geom)
       VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326))`,
      [id, altitude, ts, lon, lat]
    );
    res.json({ ok: true });
  } catch (error) {
    console.error(`[Backend] Error saving point for route ${id}:`, error);
    res.status(500).json({ message: "Failed to save point", error: String(error) });
  }
});

router.post("/:id/points", async (req, res) => {
  const { points } = req.body; // Array of { lat, lon, altitude, ts }
  const { id } = req.params;

  console.log(`[Backend] POST /tracking/${id}/points - Saving ${points?.length} points`);

  if (!points || !Array.isArray(points) || points.length === 0) {
    res.status(400).json({ message: "No points provided" });
    return;
  }

  try {
    // Construct bulk insert query
    // We'll use a transaction or just a single INSERT statement with multiple VALUES
    // For simplicity and performance, let's build a large VALUES string
    // Note: Parameter limit in Postgres is 65535, so for huge arrays we might need batching.
    // Assuming reasonable route sizes for now or we can batch in chunks of 1000.

    const chunkSize = 1000;
    for (let i = 0; i < points.length; i += chunkSize) {
      const chunk = points.slice(i, i + chunkSize);
      const values: any[] = [id];
      const placeholders: string[] = [];
      
      chunk.forEach((p: any, idx: number) => {
        const base = idx * 4 + 2; // +2 because $1 is route_id
        placeholders.push(`($1, $${base}, $${base + 1}, ST_SetSRID(ST_MakePoint($${base + 2}, $${base + 3}), 4326))`);
        values.push(p.altitude, p.ts, p.lon, p.lat);
      });

      const query = `
        INSERT INTO route_points (route_id, altitude, ts, geom)
        VALUES ${placeholders.join(", ")}
      `;

      await db.query(query, values);
    }

    console.log(`[Backend] Successfully saved ${points.length} points for route ${id}`);
    res.json({ ok: true, count: points.length });
  } catch (error) {
    console.error(`[Backend] Error saving points for route ${id}:`, error);
    res.status(500).json({ message: "Failed to save points", error: String(error) });
  }
});

router.post("/:id/finish", async (req, res) => {
  const { id } = req.params;
  console.log(`[Backend] POST /tracking/${id}/finish - Finishing route`);

  try {
    console.log(`[Backend] Calculating distance for route ${id}...`);
    const dist = await db.query(
      `WITH ordered AS (
          SELECT geom, LAG(geom) OVER (ORDER BY ts) AS prev
          FROM route_points WHERE route_id = $1
       )
       SELECT SUM(
          CASE WHEN prev IS NULL THEN 0 
               ELSE ST_DistanceSphere(prev, geom)
          END
       ) AS distance_m
       FROM ordered`,
      [id]
    );
    console.log(`[Backend] Distance calculated: ${dist.rows[0]?.distance_m}`);

    console.log(`[Backend] Calculating elevation for route ${id}...`);
    const elev = await db.query(
      `WITH ordered AS (
          SELECT altitude, LAG(altitude) OVER (ORDER BY ts) AS prev_alt
          FROM route_points WHERE route_id = $1
       )
       SELECT
          SUM(GREATEST(altitude - prev_alt, 0)) AS elevation_gain,
          SUM(GREATEST(prev_alt - altitude, 0)) AS elevation_loss
       FROM ordered`,
      [id]
    );
    console.log(`[Backend] Elevation calculated: Gain=${elev.rows[0]?.elevation_gain}, Loss=${elev.rows[0]?.elevation_loss}`);

    await db.query(
      `UPDATE routes
       SET distance = $1,
           elevation_gain = $2,
           elevation_loss = $3,
           finished_at = now()
       WHERE id = $4`,
      [
        dist.rows[0].distance_m || 0,
        elev.rows[0].elevation_gain || 0,
        elev.rows[0].elevation_loss || 0,
        id
      ]
    );
    console.log(`[Backend] Route ${id} finished successfully.`);

    res.json({
      distance: dist.rows[0].distance_m,
      elevation_gain: elev.rows[0].elevation_gain,
      elevation_loss: elev.rows[0].elevation_loss
    });
  } catch (error) {
    console.error(`[Backend] Error finishing route ${id}:`, error);
    res.status(500).json({ message: "Failed to finish route", error: String(error) });
  }
});

export default router;
