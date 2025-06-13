import db from "../db";
import bcrypt from "bcryptjs";
import helper from "../helper";
import { Err, Users } from "../Types";

async function registerClient(user: Users) {
  const checkQuery = "SELECT 1 FROM Users WHERE email = $1";
  const checkResult = await db.query(checkQuery, [user.email]);
  const rows = helper.emptyOrRows(checkResult.rows);

  if (rows.length > 0) {
    // PostgreSQL function call instead of MySQL stored procedure
    await db.query("SELECT rejestracja($1, $2, $3)", [null, user.email, false]);
    throw new Err("User with this email already exists", 409);
  } else {
    await db.query("SELECT rejestracja($1, $2, $3)", [
      user.name,
      user.email,
      true
    ]);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password_hash, salt);

  const insertQuery =
    "INSERT INTO Users (first_name, password, email, salt) VALUES ($1, $2, $3, $4, $5)";
  const insertResult = await db.query(insertQuery, [
    user.name ? user.name : null,
    hashedPassword,
    user.email,
    salt,
  ]);

  if (insertResult.rowCount === 0) {
    throw new Err("Error registering user");
  }

  return "User registered successfully";
}

export default {
  registerClient,
};
