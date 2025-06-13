import db from "../db";
import bcrypt from "bcryptjs";
import { Err, Users } from "../Types";

async function registerClient(user: Users) {
  const checkQuery = 'SELECT 1 FROM "users" WHERE email = $1';
  const checkResult = await db.query(checkQuery, [user.email]);

  if ((checkResult.rowCount ?? 0) > 0) {
    throw new Err("User with this email already exists", 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  console.log("Registering user:", user);
  await db.query(
    `
    INSERT INTO users (email, password, name, level_of_experience, fitness_level, salt)
    VALUES ($1, $2, $3, $4, $5, $6)
  `,
    [
      user.email,
      hashedPassword,
      user.name,
      user.level_of_experience || null,
      user.fitness_level || null,
      salt,
    ],
  );

  return "User registered successfully";
  console.log("Registering user:", user);
}

export default {
  registerClient,
};
