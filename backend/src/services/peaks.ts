import db from "../db";
import { Err, Peaks } from "../Types";
import helper from "../helper";

async function getPeaks(page = 1, limit = 8) {
  if (page < 1 || limit < 1) {
    throw new Err("Invalid page or limit", 400);
  }
   const offset = helper.getOffset(page, limit);
  const { query, queryParams } = helper.buildQuery("Peaks", offset, limit);
  const result = await db.query(query, queryParams);
  const totalPages = await helper.getPages("Peaks", limit);

  const rows = helper.emptyOrRows(result.rows);
  if (rows.length === 0) {
    throw new Err("No peaks found", 404);
  }
  return {
    data: rows,
    message: "Successfully fetched peaks",
    totalPages,
    page,
    limit,
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
async function getPeaksByCollectionId(collectionId: number, page = 1, limit = 7) {
  if (page < 1 || limit < 1) {
    throw new Err("Invalid page or limit", 400);
  }

  const offset = helper.getOffset(page, limit);

  const query = `
    SELECT p.id, p.name, p.elevation, p.region, p.latitude, p.longitude, p.verified
    FROM peaks p
    JOIN peak_collection_peaks pcp ON p.id = pcp.peak_id
    WHERE pcp.collection_id = $1
    ORDER BY p.elevation DESC
    LIMIT $2 OFFSET $3
  `;
  const result = await db.query(query, [collectionId, limit, offset]);

  const countQuery = `
    SELECT COUNT(*) AS count
    FROM peak_collection_peaks
    WHERE collection_id = $1
  `;
  const countResult = await db.query(countQuery, [collectionId]);
  const totalCount = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: result.rows,
    message: `Successfully fetched peaks from collection ${collectionId}`,
    totalPages,
    page,
    limit,
  };
}




export default {
    getPeaks,
    getPeakById,
    updatePeak,
    getPeaksByCollectionId,
    };