import db from "../db";
import { Err, FeaturesList } from "../Types";

async function getAll() {
  const query = 'SELECT * FROM "trail_features" ORDER BY name';
  const result = await db.query(query);
  if (result.rows.length === 0) {
    throw new Err("No features found", 404);
  }
  return {
    data: result.rows as FeaturesList[],
    message: "Features retrieved successfully",
  };
}

async function getById(id: number) {
  const query = 'SELECT * FROM "trail_features" WHERE id = $1';
  const result = await db.query(query, [id]);
  if (result.rows.length === 0) {
    throw new Err("Feature not found", 404);
  }
  return {
    data: result.rows[0] as FeaturesList,
    message: "Feature retrieved successfully",
  };
}

async function updateTrailFeatures(trailId: number, featureIds: number[]) {
  try {
    // Usuń stare powiązania cech z trasą
    const deleteQuery = "DELETE FROM trail_trail_features WHERE trail_id = $1";
    await db.query(deleteQuery, [trailId]);

    if (featureIds.length === 0) {
      return { message: "Brak cech do aktualizacji" };
    }

    // Przygotuj zapytanie dla każdej cechy osobno
    for (const featureId of featureIds) {
      const insertQuery = `
        INSERT INTO trail_trail_features (trail_id, feature_id)
        VALUES ($1, $2)
      `;

      await db.query(insertQuery, [trailId, featureId]);
    }

    return { message: "Cechy trasy zostały zaktualizowane pomyślnie" };
  } catch (error) {
    throw new Err("Nie udało się zaktualizować cech trasy", 500);
  }
}

export default {
  getAll,
  getById,
  updateTrailFeatures,
};
