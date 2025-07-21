import db from "../db";
import bcrypt from "bcryptjs";
import { Err } from "../Types";
import { QueryResult } from "pg";

async function fetchClient(email: string, userInputPassword: string) {
  if (!email || !userInputPassword) {
    const error = new Err(
      "Invalid arguments: email and userInputPassword are required",
    );
    error.statusCode = 400;
    throw error;
  }
  const queryGetSalt = 'SELECT salt FROM "users" WHERE email = $1';
  const saltResult: QueryResult = await db.query(queryGetSalt, [email]);

  if (saltResult.rows.length === 0) {
    const error = new Err("User not found");
    error.statusCode = 404;
    throw error;
  }

  const salt = saltResult.rows[0]["salt"];

  const hashedPassword = await bcrypt.hash(userInputPassword, salt);

  const queryCheckUser =
    'SELECT id, role FROM "users" WHERE email = $1 AND password = $2';

  const userExists = await db.query(queryCheckUser, [email, hashedPassword]);

  if (userExists.rows.length === 0) {
    const error = new Err("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const user = userExists.rows[0];

  return {
    response: { statusCode: 200 },
    id: user.id,
    email,
    userRole: user.role,
  };
}

export default {
  fetchClient,
};
