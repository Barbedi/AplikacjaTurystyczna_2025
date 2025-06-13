import db from "../db.js";
import bcrypt from "bcryptjs";
import { Err, Users } from "../Types.js";

async function registerClient(user: Users) {
  const checkQuery = 'SELECT 1 FROM "Users" WHERE email = $1';
  const checkResult = await db.query(checkQuery, [user.email]);

  if ((checkResult.rowCount ?? 0) > 0) {
    throw new Err("User with this email already exists", 409);
  }

  const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(user.password_hash, salt);

await db.query(`
  INSERT INTO "Users" (name, email, password_hash, salt)
  VALUES ($1, $2, $3, $4)
`, [user.name || null, user.email, hashedPassword, salt]);


  return "User registered successfully";
}

export default {
  registerClient,
};
