import db from "../db";
import { Err, Peaks } from "../Types";
import helper from "../helper";

// Pobieranie wszystkich szczytów
async function getPeaks() {
  const query = `
    SELECT id, name, elevation, region, latitude, longitude
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
  p.elevation AS peak_elevation,
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
  const totalCountQuery = `
    SELECT COUNT(DISTINCT p.id) AS count
    FROM peaks p
    JOIN user_peaks up ON p.id = up.peak_id
    WHERE up.user_id = $1
  `;
  const totalCountResult = await db.query(totalCountQuery, [userId]);
  const totalCount = parseInt(totalCountResult.rows[0].count);
  return {
    data: rows,
    message: "Successfully fetched peaks for user",
    page,
    limit,
    total: totalCount,
  };
}

async function getUserPeakById(userId: number, peakId: number) {
  const query = `
    SELECT p.id, p.name, p.elevation, p.region, p.latitude, p.longitude,
           up.visited_at, up.description, up.photo_url, up.verified
    FROM peaks p
    JOIN user_peaks up ON p.id = up.peak_id
    WHERE up.user_id = $1 AND p.id = $2
  `;
  const result = await db.query(query, [userId, peakId]);
  const row = result.rows[0];

  if (!row) {
    throw new Err("User peak not found", 404);
  }

  return {
    data: row,
    message: "Successfully fetched user peak",
  };
}

// Pobieranie wszystkich zdjęć dla szczytu
async function getPeakPhotos(peakId: number) {
  const query = `
    SELECT up.photo_url, up.visited_at, up.description, u.email as user_email
    FROM user_peaks up
    JOIN users u ON up.user_id = u.id
    WHERE up.peak_id = $1 AND up.photo_url IS NOT NULL
    ORDER BY up.visited_at DESC
  `;
  const result = await db.query(query, [peakId]);
  const rows = result.rows;

  return {
    data: rows,
    message: "Successfully fetched peak photos",
    total: rows.length,
  };
}

// Tworzenie nowego szczytu
async function createPeak(peakInfo: Peaks) {
  if (!peakInfo || !peakInfo.name || !peakInfo.elevation) {
    throw new Err("Invalid peak data", 400);
  }

  const query = `
    INSERT INTO peaks (name, elevation, region, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, elevation, region, latitude, longitude;
  `;
  const values = [
    peakInfo.name,
    peakInfo.elevation,
    peakInfo.region,
    peakInfo.latitude,
    peakInfo.longitude,
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
async function addPeakUsers(
  peakId: number,
  userId: number,
  description?: string,
  photoUrl?: string,
) {
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
    SELECT id, name, elevation, region, latitude, longitude
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
    SET name = $1, elevation = $2, region = $3, latitude = $4, longitude = $5
    WHERE id = $6
    RETURNING id, name, elevation, region, latitude, longitude;
  `;
  const values = [
    peakInfo.name,
    peakInfo.elevation,
    peakInfo.region,
    peakInfo.latitude,
    peakInfo.longitude,
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
// async function updatePeakImage(id: number, imageFilename: string) {
//   const query = `
//     UPDATE peaks
//     SET image_filename = $1
//     WHERE id = $2
//     RETURNING id, name, elevation, region, latitude, longitude, verified, image_filename;
//   `;

//   const result = await db.query(query, [imageFilename, id]);
//   const rows = result.rows;

//   if (rows.length === 0) {
//     throw new Err("Peak not found", 404);
//   }

//   return {
//     data: rows[0],
//     message: "Successfully updated peak image",
//   };
// }
// Pobieranie szczytów z kolekcji
async function getPeaksByCollectionId(
  collectionId: number,
  page = 1,
  limit = 6,
  all: boolean = false,
) {
  if (!all && (page < 1 || limit < 1)) {
    throw new Err("Invalid page or limit", 400);
  }

  if (all) {
    const queryAll = `
      SELECT p.id, p.name, p.elevation, p.region, p.latitude, p.longitude
      FROM peaks p
      JOIN peak_collection_peaks pcp ON p.id = pcp.peak_id
      WHERE pcp.collection_id = $1
      ORDER BY p.elevation DESC
    `;
    const resultAll = await db.query(queryAll, [collectionId]);
    return {
      data: resultAll.rows,
      message: `Successfully fetched all peaks from collection ${collectionId}`,
      total: resultAll.rows.length,
    };
  }

  const offset = helper.getOffset(page, limit);

  const query = `
    SELECT p.id, p.name, p.elevation, p.region, p.latitude, p.longitude
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
    SELECT id, name, elevation, region, latitude, longitude
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

// Dodaj funkcje do zarządzania user_peaks z verified i photo

async function updateUserPeakPhoto(
  userId: number,
  peakId: number,
  photoUrl: string,
) {
  // Najpierw spróbuj zaktualizować
  const updateQuery = `
    UPDATE user_peaks 
    SET photo_url = $1 
    WHERE user_id = $2 AND peak_id = $3
    RETURNING *;
  `;
  let result = await db.query(updateQuery, [photoUrl, userId, peakId]);

  // Jeśli nie ma rekordu, utwórz go
  if (result.rows.length === 0) {
    const insertQuery = `
      INSERT INTO user_peaks (user_id, peak_id, visited_at, photo_url)
      VALUES ($1, $2, NOW(), $3)
      RETURNING *;
    `;
    result = await db.query(insertQuery, [userId, peakId, photoUrl]);
  }

  return {
    data: result.rows[0],
    message: "Successfully updated user peak photo",
  };
}

async function updateUserPeakVerification(
  userId: number,
  peakId: number,
  verified: boolean,
) {
  // Najpierw spróbuj zaktualizować
  const updateQuery = `
    UPDATE user_peaks 
    SET verified = $1 
    WHERE user_id = $2 AND peak_id = $3
    RETURNING *;
  `;
  let result = await db.query(updateQuery, [verified, userId, peakId]);

  // Jeśli nie ma rekordu, utwórz go
  if (result.rows.length === 0) {
    const insertQuery = `
      INSERT INTO user_peaks (user_id, peak_id, visited_at, verified)
      VALUES ($1, $2, NOW(), $3)
      RETURNING *;
    `;
    result = await db.query(insertQuery, [userId, peakId, verified]);
  }

  return {
    data: result.rows[0],
    message: "Successfully updated user peak verification",
  };
}

export default {
  getPeakByUserId,
  getPeaks,
  createPeak,
  addPeakUsers,
  getPeakById,
  updatePeak,
  // updatePeakImage,
  getPeaksByCollectionId,
  searchPeaks,
  getUserPeakById,
  getPeakPhotos,
  updateUserPeakPhoto,
  updateUserPeakVerification,
};
