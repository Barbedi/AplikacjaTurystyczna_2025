import db from "../db";
import { Err, Peaks, } from "../Types";
import helper from "../helper";

// Pobieranie wszystkich szczytów
async function getPeaks() {
  const query = `
    SELECT id, name, elevation, region, latitude, longitude, verified, image_filename
    FROM peaks
    ORDER BY elevation DESC
  `;
  const result = await db.query(query);

  const rows = helper.emptyOrRows(result.rows);
  if (rows.length === 0) {
    throw new Err("No peaks found", 404);
  }
  return {
    data: rows,
    message: "Successfully fetched all peaks",
    total: rows.length,
  };
}
//pobieranie szczytu zdobytych po id użytkownika
async function getPeakByUserId(userId: number, page = 1, limit = 12) {
  if (!userId) {
    throw new Err("User ID is required", 400);
  }
  if (page < 1 || limit < 1) {
    throw new Err("Invalid page or limit", 400);
  }
  const offset = helper.getOffset(page, limit);
  const query = `
  SELECT DISTINCT ON (p.id)
  p.id AS peak_id,
  p.name AS peak_name,
  up.visited_at AS last_visited,
  up.description,
  up.photo_url,
  COUNT(*) OVER (PARTITION BY p.id) AS times_visited
FROM peaks p
JOIN user_peaks up ON p.id = up.peak_id
WHERE up.user_id = $1
ORDER BY p.id, up.visited_at DESC
LIMIT $2 OFFSET $3
  `;
  const result = await db.query(query, [userId, limit, offset]);
  const rows = helper.emptyOrRows(result.rows);
  if (rows.length === 0) {
    throw new Err("No peaks found for this user", 404);
  }

  return {
    data: rows,
    message: "Successfully fetched peaks for user",
    page,
    limit,
  };
}


async function getUserPeakById(userId: number,peakId: number) {
  if (!userId) {
    throw new Err("User ID is required", 400);
  }
  const query = `
    SELECT p.id, p.name, p.elevation, p.region, p.latitude, p.longitude, p.verified, p.image_filename,
           up.visited_at, up.description, up.photo_url
    FROM peaks p
    JOIN user_peaks up ON p.id = up.peak_id
    WHERE up.user_id = $1 AND p.id = $2
    ORDER BY up.visited_at DESC;
  `;
  const result = await db.query(query, [userId, peakId]);
  const rows = helper.emptyOrRows(result.rows);
  
  if (rows.length === 0) {
    throw new Err("No peaks found for this user", 404);
  }

  return {
    data: rows[0],
    message: "Successfully fetched peak for user",
  };
}

// Tworzenie nowego szczytu
async function createPeak(peakInfo: Peaks) {
  if (!peakInfo || !peakInfo.name || !peakInfo.elevation) {
    throw new Err("Invalid peak data", 400);
  }

  const query = `
    INSERT INTO peaks (name, elevation, region, latitude, longitude, verified, image_filename)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, elevation, region, latitude, longitude, verified, image_filename;
  `;
  const values = [
    peakInfo.name,
    peakInfo.elevation,
    peakInfo.region,
    peakInfo.latitude,
    peakInfo.longitude,
    peakInfo.verified,
    peakInfo.image_filename,
  ];

  const result = await db.query(query, values);
  const rows = result.rows;
  if (rows.length === 0) {
    throw new Err("Failed to create peak", 500);
  }

  return {
    data: rows[0],
    message: "Successfully created new peak",
  };
}

// Dodawanie szczytu do użytkownika
async function addPeakUsers(peakId: number, userId: number, description?: string, photoUrl?: string) {
  if (!userId) {
    throw new Err("User ID is required", 400);
  }
  const query = `
    INSERT INTO user_peaks (peak_id, user_id, visited_at, description, photo_url)
    VALUES ($1, $2, NOW(), $3, $4)
    RETURNING id, peak_id, user_id, visited_at, description, photo_url;
  `;
  const values = [peakId, userId, description || null, photoUrl || null];
  const result = await db.query(query, values);
  const rows = result.rows;

  if (rows.length === 0) {
    throw new Err("Failed to add user to peak", 500);
  }

  return {
    data: rows[0],
    message: "Successfully added user to peak",
  };
}

// Pobieranie szczytu po ID
async function getPeakById(id: number) {
  const query = `
    SELECT id, name, elevation, region, latitude, longitude, verified, image_filename
    FROM peaks
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

// Aktualizacja szczytu
async function updatePeak(id: number, peakInfo: Peaks) {
  if (!peakInfo || !peakInfo.name || !peakInfo.elevation) {
    throw new Err("Invalid peak data", 400);
  }

  const query = `

    UPDATE peaks
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
// Aktualizacja obrazu szczytu
async function updatePeakImage(id: number, imageFilename: string) {
  const query = `
    UPDATE peaks
    SET image_filename = $1
    WHERE id = $2
    RETURNING id, name, elevation, region, latitude, longitude, verified, image_filename;
  `;

  const result = await db.query(query, [imageFilename, id]);
  const rows = result.rows;

  if (rows.length === 0) {
    throw new Err("Peak not found", 404);
  }

  return {
    data: rows[0],
    message: "Successfully updated peak image",
  };
}
// Pobieranie szczytów z kolekcji
async function getPeaksByCollectionId(
  collectionId: number,
  page = 1,
  limit = 6,
) {
  if (page < 1 || limit < 1) {
    throw new Err("Invalid page or limit", 400);
  }

  const offset = helper.getOffset(page, limit);

  const query = `
    SELECT p.id, p.name, p.elevation, p.region, p.latitude, p.longitude, p.verified, p.image_filename
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
//szukanie szczytów
async function searchPeaks(query: string) {
  if (!query || query.trim() === "") {
    throw new Err("Search query cannot be empty", 400);
  }
  const searchQuery = `
    SELECT id, name, elevation, region, latitude, longitude, verified, image_filename
    FROM peaks
    WHERE name ILIKE $1
    ORDER BY elevation DESC
  `;
  const result = await db.query(searchQuery, [`%${query}%`]);
  const rows = result.rows;

  return {
    data: rows,
    message: "Successfully searched peaks",
    total: rows.length,
  };
}

export default {
  getPeakByUserId,
  getPeaks,
  createPeak,
  addPeakUsers,
  getPeakById,
  updatePeak,
  updatePeakImage,
  getPeaksByCollectionId,
  searchPeaks,
  getUserPeakById
};
