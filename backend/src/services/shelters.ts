import db from "../db";
import helper from "../helper";
import { Err } from "../Types";

async function getALLShelter() {
  const query = `
    SELECT s.id, s.name, s.latitude, s.longitude, s.altitude, m.name AS mountain_range
    FROM shelters s
    JOIN mountain_ranges m ON s.mountain_range_id = m.id
  `;

  const result = await db.query(query);
  const data = helper.emptyOrRows(result.rows);

  if (data.length === 0) {
    throw new Err("No shelters found", 404);
  }

  return {
    data,
    message: "Successfully fetched all shelters",
  };
}

export default {
  getALLShelter,
};
