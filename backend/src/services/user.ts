import db from "../db";
import helper from "../helper";
import config from "../config";
import { Err } from "../Types";

async function get(page = 1, limit = config.listPerPage, filter?: string, sort?: string) {
  const offset = helper.getOffset(page, limit);
  const queryParams: any[] = [];

  let query = `
  SELECT u.id, u.email, u.name, u.level_of_experience, u.fitness_level, u.created_at, u.profile_image
  FROM Users u
`;
  if (filter) {
    const filterQuery = helper.buildFilterQuery(filter, queryParams.length + 1);
    query += filterQuery.query;
    queryParams.push(...filterQuery.queryParams);
  }
  if (sort) {
    const sortQuery = helper.buildSortQuery(sort);
    query += sortQuery.query; 
  }
  queryParams.push(limit, offset);
  query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

  const result = await db.query(query, queryParams);
  const data = helper.emptyOrRows(result.rows);

  if (data.length === 0) {
    throw new Err("No users found", 404);
  }

 const countResult = await db.query(`SELECT COUNT(*) FROM Users`);
const total = parseInt(countResult.rows[0].count);
const pages = Math.ceil(total / limit);
const meta = { page, pages, limit, total };


  return {
    data,
    meta,
    message: "Successfully fetched users",
  };
}

async function getByEmail(email: string) {
  const query = `
    SELECT id, email, name, level_of_experience, fitness_level, created_at, profile_image
    FROM Users
    WHERE email = $1
    LIMIT 1;
  `;

  const result = await db.query(query, [email]);
  const rows = result.rows;

  if (rows.length === 0) {
    throw new Err("User not found", 404);
  }

  return {
    data: rows[0], // zwracasz pojedyńczy obiekt
    message: "Successfully fetched user",
  };
}
async function getById(id: number) {
  const query = `
    SELECT id, email, name, level_of_experience, fitness_level, created_at, profile_image
    FROM Users
    WHERE id = $1
    LIMIT 1;
  `;

  const result = await db.query(query, [id]);
  const rows = result.rows;

  if (rows.length === 0) {
    throw new Err("User not found", 404);
  }

  return {
    data: rows[0], // zwracasz pojedyńczy obiekt
    message: "Successfully fetched user",
  };
}

async function updateImg(id: number, profileImage: string) {
  if (!profileImage) {
    throw new Err("Profile image is required", 400);
  }

  const checkResult = await db.query(
    `SELECT 1 FROM Users WHERE id = $1`,
    [id]
  );
  if (checkResult.rowCount === 0) {
    throw new Err("User not found", 404);
  }

  const result = await db.query(
    `UPDATE Users SET profile_image = $1 WHERE id = $2`,
    [profileImage, id]
  );

  if (result.rowCount === 0) {
    throw new Err("Failed to update user image", 500);
  }

  return {
    message: "Successfully updated user image",
  };
}



export default {
  get,
    getByEmail,
    getById,
  updateImg,
  // Możesz dodać inne metody, takie jak getById, getByEmail, update itp.
  // Pamiętaj, aby odpowiednio obsłużyć błędy i walidację danych wejściowych.
};