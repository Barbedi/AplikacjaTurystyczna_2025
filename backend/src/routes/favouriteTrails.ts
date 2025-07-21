import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import favouriteTrailsService from "../services/favouriteTrails";


/**
 * @openapi
 * /favourite-trails:
 *   post:
 *     tags:
 *       - Favourite Trails
 *     summary: Add a trail to favourites
 *     description: Adds a trail to the user's favourites.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trail_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Trail added to favourites successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post("/", verifyUser, async (req, res, next) => {
  const { trail_id } = req.body;
   
  const userId = (req.user as { id: number }).id;

  try {
    const result = await favouriteTrailsService.addFavouriteTrail(userId, trail_id);
    res.status(200).json({ message: "Trail added to favourites successfully.", data: result });
  } catch (error) {
    next(error);
  }
});
/**
 * @openapi
 * /favourite-trails:
 *   get:
 *     tags:
 *       - Favourite Trails
 *     summary: Get user's favourite trails
 *     description: Retrieves all favourite trails for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved favourite trails.
 *       403:
 *         description: Unauthorized access.
 */

router.get("/", verifyUser, async (req, res, next) => {
  
  const userId = (req.user as { id: number }).id;

  try {
    const trails = await favouriteTrailsService.getFavouriteTrails(userId);
    res.status(200).json({ data: trails });
  } catch (error) {
    next(error);
  }
});
/**
 * @openapi
 * /favourite-trails/{trailId}:
 *   delete:
 *     tags:
 *       - Favourite Trails
 *     summary: Remove a trail from favourites
 *     description: Removes a trail from the authenticated user's favourites.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trailId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trail to be removed from favourites.
 *     responses:
 *       200:
 *         description: Trail removed from favourites successfully.
 *       403:
 *         description: Unauthorized access.
 *       404:
 *         description: Trail not found in user's favorites.
 */
router.delete("/:trailId", verifyUser, async (req, res, next) => {
  if (!req.user || typeof req.user !== 'object' || !('id' in req.user)) {
    return next(new Error('User authentication failed'));
  }
  
  const userId = (req.user as { id: number }).id;
  const trailId = parseInt(req.params["trailId"] || "0", 10);
  
  if (!trailId) {
    return next(new Error('Invalid trail ID'));
  }

  try {
    const result = await favouriteTrailsService.removeFavouriteTrail(userId, trailId);
    res.status(200).json({ message: "Trail removed from favourites successfully.", data: result });
  } catch (error) {
    next(error);
  }
});


export default router;  