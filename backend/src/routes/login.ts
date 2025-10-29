import express from "express";
const router = express.Router();
import loginService from "../services/login";
import jwt from "jsonwebtoken";

/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Autoryzuje użytkownika za pomocą adresu e-mail i hasła, generując tokeny JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Użytkownik został pomyślnie zalogowany. Zwraca dane użytkownika i status autoryzacji.
 *       401:
 *         description: Nieprawidłowy e-mail lub hasło.
 *       404:
 *         description: Użytkownik nie został znaleziony.
 *       400:
 *         description: Nieprawidłowe dane wejściowe (np. brak e-maila lub hasła).
 *       500:
 *         description: Błąd serwera.
 */

router.post("/", async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const {
      id: userId,
      email: userEmail,
      userRole,
    } = await loginService.fetchClient(email, password);

    const token = jwt.sign(
      { id: userId, email: userEmail, role: userRole },
      process.env["SECRET_TOKEN"] as string,
      { expiresIn: "15m" } 
    );

    const refreshToken = jwt.sign(
      { id: userId, email: userEmail, role: userRole },
      process.env["REFRESH_SECRET_TOKEN"] as string,
      { expiresIn: "7d" }
    );
    res.set({
      Authorization: `Bearer ${token}`,
      "Refresh-Token": `Bearer ${refreshToken}`,
    });

    const isProd = process.env["NODE_ENV"] === "production";

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",  // ← lax dla dev
      secure: isProd,                      // ← false w dev
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshJwt", refreshToken, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",  // ← lax dla dev
      secure: isProd,                      // ← false w dev
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      auth: true,
      token,          
      refreshToken,   
      user: {
        id: userId,
        email: userEmail,
        role: userRole,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;

