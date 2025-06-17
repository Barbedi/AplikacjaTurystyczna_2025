import express from "express";
const router = express.Router();
import registerService from "../services/register";
import { Users } from "../Types";

/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *       - Authentication
 *       - Users
 *     summary: User registration
 *     description: Register a new user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mysecurepassword
 *               name:
 *                 type: string
 *                 example: Gate4
 *               level_of_experience:
 *                 type: string
 *                 example: beginner
 *               fitness_level:
 *                 type: string
 *                 example: intermediate
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Registration success message.
 *                   example: User registered successfully.
 *       '400':
 *         description: Bad request - missing or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid request data
 *       '409':
 *         description: Conflict - user with this email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User with this email already exists
 *       '500':
 *         description: Internal server error.
 */
router.post("/", async function (req, res, next) {
  try {
    const user: Users = req.body;
    const message = await registerService.registerClient(user);
    res.status(201).json({ message });
  } catch (err: any) {
    console.error("Błąd w registerClient:", err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

export default router;
