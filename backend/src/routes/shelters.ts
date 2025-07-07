import express from "express";
const router = express.Router();
import shelterService from "../services/shelters";
/**
 * @openapi
 * /shelters:
 *   get:
 *     tags:
 *       - Shelters
 *     summary: Get all shelters
 *     responses:
 *       200:
 *         description: Successfully fetched all shelters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                       altitude:
 *                         type: number
 *                       mountain_range:
 *                         type: string
 *       404:
 *         description: No shelters found
 *       500:
 *         description: Internal server error
 */
router.get("/", async (_req, res, next) => {
  try {
    const result = await shelterService.getALLShelter();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
