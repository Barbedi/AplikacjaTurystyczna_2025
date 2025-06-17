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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: client
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
    const { email: id, userRole } = await loginService.fetchClient(email, password);

    const token = jwt.sign(
      { email: id, role: userRole },
      process.env["SECRET_TOKEN"] as string,
      { expiresIn: 86400 } // 1 dzień
    );

    const refreshToken = jwt.sign(
      { email: id, role: userRole },
      process.env["REFRESH_SECRET_TOKEN"] as string,
      { expiresIn: 60 * 60 * 24 * 365 } // 1 rok
    );

    // Ustawienie tokenów w nagłówkach
    res.set({
      Authorization: `Bearer ${token}`,
      "Refresh-Token": `Bearer ${refreshToken}`,
    });

    // Ustawienie tokenów jako ciasteczek
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60000), // 1 minuta
      httpOnly: true,
    });

    res.cookie("refreshJwt", refreshToken, {
      expires: new Date(Date.now() + 604800000), // 7 dni
      httpOnly: true,
    });

    res.status(200).json({
      auth: true,
      user: {
        email: id,
        role: userRole,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
