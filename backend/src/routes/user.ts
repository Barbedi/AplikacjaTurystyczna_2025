import express from "express";
import userService from "../services/user";
import { verifyUser } from "../middlewares/verifyUser";
import { Err } from "../Types";

const router = express.Router();
/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Pobierz listę użytkowników
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numer strony
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Ilość wyników na stronę
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filtr (np. po nazwie)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sortowanie (np. "name ASC")
 *     responses:
 *       200:
 *         description: Lista użytkowników
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Brak autoryzacji
 *       500:
 *         description: Błąd serwera
 */

router.get("/", verifyUser, async (req, res) => {
  const page = parseInt(req.query["page"] as string) || 1;
  const limit = parseInt(req.query["limit"] as string) || 10;
  const filter = req.query["filter"] as string | undefined;
  const sort = req.query["sort"] as string | undefined;

  try {
    const result = await userService.get(page, limit, filter, sort);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Err) {
      res.status(err.statusCode || 500).json({ message: err.message });
    } else {
      console.error("Unknown error in GET /users:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

/**
 * @openapi
 * /users/{email}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Pobierz dane użytkownika po adresie e-mail
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dane użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Użytkownik nie został znaleziony
 *       401:
 *         description: Brak autoryzacji
 *       500:
 *         description: Błąd serwera
 */

router.get("/:email", verifyUser, async (req, res) => {
  const email = req.params["email"] as string;

  try {
    const result = await userService.getByEmail(email);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Err) {
      res.status(err.statusCode || 500).json({ message: err.message });
    } else {
      console.error("Unknown error in GET /users/:email:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

/**
 * @openapi
 * /users/{id}/img:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Aktualizuj zdjęcie użytkownika
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - img
 *             properties:
 *               img:
 *                 type: string
 *                 description: Base64 lub URL zdjęcia
 *     responses:
 *       200:
 *         description: Zdjęcie zaktualizowane pomyślnie
 *       400:
 *         description: Brakuje ID lub obrazu
 *       404:
 *         description: Użytkownik nie został znaleziony
 *       500:
 *         description: Błąd serwera
 */
router.patch("/:id/img", verifyUser, async function (req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id as string, 10);
    const { img: profileImage } = req.body;

    if (!parsedId || !profileImage) {
      res.status(400).json({ message: "ID i zdjęcie są wymagane." });
      return;
    }

    const { message } = await userService.updateImg(parsedId, profileImage);
    res.status(200).json({ message });
    return;
  } catch (err) {
    next(err);
    return;
  }
});

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Aktualizuj dane użytkownika
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Pomyślnie zaktualizowano dane użytkownika
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 *       404:
 *         description: Użytkownik nie został znaleziony
 *       500:
 *         description: Błąd serwera
 */
router.patch("/:id", verifyUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id as string);
    const userInfo = req.body;

    const { message } = await userService.update(parsedId, userInfo);
    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
});

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: user@example.com
 *         name:
 *           type: string
 *           example: Jan Kowalski
 *         level_of_experience:
 *           type: string
 *           example: średniozaawansowany
 *         fitness_level:
 *           type: string
 *           example: wysoki
 *         profile_img:
 *           type: string
 *           example: https://example.com/image.jpg
 */
