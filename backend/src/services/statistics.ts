import db from "../db";
import { Statistics } from "../Types";

async function getStatisticsForUser(userId: number): Promise<Statistics> {
  const allUserPeaksQuery = await db.query(
    `SELECT COUNT(*) FROM user_peaks WHERE user_id = $1`,
    [userId],
  );
  const allUserTrailsAddedQuery = await db.query(
    `SELECT COUNT(*) FROM trails WHERE created_by = $1 AND is_public = false`,
    [userId],
  );
  const allUserTrailsSharedQuery = await db.query(
    `SELECT COUNT(*) FROM shared_trails WHERE user_id = $1`,
    [userId],
  );

  const longestTrailQuery = await db.query(
    `
    SELECT t.name, t.length_km
    FROM trails t 
    WHERE t.created_by = $1
    ORDER BY t.length_km DESC
    LIMIT 1
  `,
    [userId],
  );

  const highestPeakQuery = await db.query(
    `
    SELECT p.name, p.elevation
    FROM peaks p 
    JOIN user_peaks up ON p.id = up.peak_id
    WHERE up.user_id = $1
    ORDER BY p.elevation DESC
    LIMIT 1
  `,
    [userId],
  );

  const lastPeakQuery = await db.query(
    `
    SELECT p.name, up.created_at
    FROM user_peaks up
    JOIN peaks p ON up.peak_id = p.id
    WHERE up.user_id = $1
    ORDER BY up.created_at DESC
    LIMIT 1
  `,
    [userId],
  );

  const crownKGPUserQuery = await db.query(
    `
    SELECT COUNT(DISTINCT up.peak_id)
    FROM user_peaks up
    JOIN peaks p ON up.peak_id = p.id
    JOIN peak_collection_peaks pcp ON p.id = pcp.peak_id
    JOIN peak_collections pc ON pcp.collection_id = pc.id
    WHERE up.user_id = $1
      AND pc.id = 1
      AND up.verified = true;
  `,
    [userId],
  );

  const crownKBSUserQuery = await db.query(
    `
    SELECT COUNT(DISTINCT up.peak_id)
    FROM user_peaks up
    JOIN peaks p ON up.peak_id = p.id
    JOIN peak_collection_peaks pcp ON p.id = pcp.peak_id
    JOIN peak_collections pc ON pcp.collection_id = pc.id
    WHERE up.user_id = $1
      AND pc.id = 2
      AND up.verified = true;
  `,
    [userId],
  );

  const allKGPQuery = await db.query(`
    SELECT COUNT(*)
    FROM peak_collection_peaks pcp
    JOIN peak_collections pc ON pcp.collection_id = pc.id
    WHERE pc.id = 1;
  `);

  const allKBSQuery = await db.query(`
    SELECT COUNT(*)
    FROM peak_collection_peaks pcp
    JOIN peak_collections pc ON pcp.collection_id = pc.id
    WHERE pc.id = 2;
  `);

  const crownKGPCount = Number(crownKGPUserQuery.rows[0].count);
  const allKGPCount = Number(allKGPQuery.rows[0].count);

  const crownKBSCount = Number(crownKBSUserQuery.rows[0].count);
  const allKBSCount = Number(allKBSQuery.rows[0].count);

  return {
    crowns: {
      kgp: {
        visited: crownKGPCount,
        all: allKGPCount,
        percent: allKGPCount
          ? Math.round((crownKGPCount / allKGPCount) * 10000) / 100
          : 0,
      },
      kbs: {
        visited: crownKBSCount,
        all: allKBSCount,
        percent: allKBSCount
          ? Math.round((crownKBSCount / allKBSCount) * 10000) / 100
          : 0,
      },
    },
    longestTrail: longestTrailQuery.rows[0] || null,
    highestPeak: highestPeakQuery.rows[0] || null,
    lastPeak: lastPeakQuery.rows[0] || null,
    allUserPeaks: Number(allUserPeaksQuery.rows[0].count),
    allUserTrails: Number(allUserTrailsAddedQuery.rows[0].count),
    allUserTrailsShared: Number(allUserTrailsSharedQuery.rows[0].count),
  };
}

export default {
  getStatisticsForUser,
};
