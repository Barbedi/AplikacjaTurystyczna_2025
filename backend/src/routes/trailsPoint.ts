import TrailPointsService from "../services/trailsPoint";
import TrailsService from "../services/trails";
import { Router } from "express";
import { Err } from "../Types";

const router = Router();

/**
 * @openapi
 * /TrailsPoints:
 *   post:
 *     tags:
 *       - TrailsPoints
 *     summary: Create a new trail with points
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - points
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Trail to the Peak"
 *               description:
 *                 type: string
 *                 example: "A beautiful trail leading to the peak."
 *               points:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: number
 *                       example: [37.7749, -122.4194]
 *                     name:
 *                       type: string
 *                       example: "Starting Point"
 *                     point_order:
 *                       type: integer
 *                       example: 0
 *     responses:
 *       '201':
 *         description: Trail created successfully with points.
 *       '400':
 *         description: Bad request - missing or invalid data.
 *       '500':
 *         description: Internal server error.
 */

router.post("/", async (req, res, next) => {
  try {
    const { points, ...trailData } = req.body;

    const newTrail = await TrailsService.createTrail(trailData);

    if (points && Array.isArray(points)) {
      const parsedPoints = points.map((p: any, i: number) => ({
        lat: p.coordinates[0],
        lng: p.coordinates[1],
        name: p.name,
        point_order: i,
      }));

      await TrailPointsService.addPointsForTrail(newTrail.id, parsedPoints);
    }

    res.status(201).json({ data: newTrail });
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

export default router;
