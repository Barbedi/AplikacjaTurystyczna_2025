import db from "../db";
import { Err, Peaks } from "../Types";

async function getPeaks() {
  const query = `
    SELECT id, name, elevation, region, latitude, longitude, verified
    FROM Peaks
    ORDER BY elevation DESC
  `;
  const result = await db.query(query);
  const rows = result.rows;

  if (rows.length === 0) {
    throw new Err("No peaks found", 404);
  }

  return {
    data: rows,
    message: "Successfully fetched peaks",
  };
}
async function getPeakById(id: number) {
  const query = `
    SELECT id, name, elevation, region, latitude, longitude, verified
    FROM Peaks
    WHERE id = $1
    LIMIT 1;
  `;
  const result = await db.query(query, [id]);
  const rows = result.rows;

  if (rows.length === 0) {
    throw new Err("Peak not found", 404);
  }

  return {
    data: rows[0],
    message: "Successfully fetched peak",
  };
}

async function updatePeak(id: number, peakInfo: Peaks) {
  if (!peakInfo || !peakInfo.name || !peakInfo.elevation) {
    throw new Err("Invalid peak data", 400);
  }

  const query = `
    UPDATE Peaks
    SET name = $1, elevation = $2, region = $3, latitude = $4, longitude = $5, verified = $6
    WHERE id = $7
    RETURNING id, name, elevation, region, latitude, longitude, verified;
  `;
  const values = [
    peakInfo.name,
    peakInfo.elevation,
    peakInfo.region,
    peakInfo.latitude,
    peakInfo.longitude,
    peakInfo.verified,
    id,
  ];
  
  const result = await db.query(query, values);
  const rows = result.rows;

  if (rows.length === 0) {
    throw new Err("Peak not found", 404);
  }

  return {
    data: rows[0],
    message: "Successfully updated peak",
  };
}
async function getPeaksByCollectionId(collectionId: number) {
  const query = `
    SELECT p.id, p.name, p.elevation, p.region, p.latitude, p.longitude, p.verified
    FROM peaks p
    JOIN peak_collection_peaks pcp ON p.id = pcp.peak_id
    WHERE pcp.collection_id = $1
    ORDER BY p.elevation DESC;
  `;
  const result = await db.query(query, [collectionId]);
  const rows = result.rows;

  if (rows.length === 0) {
    throw new Err("No peaks found for collection ID: " + collectionId, 404);
  }

  return {
    data: rows,
    message: "Successfully fetched peaks from collection " + collectionId,
  };
}



export default {
    getPeaks,
    getPeakById,
    updatePeak,
    getPeaksByCollectionId,
    };