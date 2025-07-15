import TrailPointsService from "../services/trailsPoint";
import TrailsService from "../services/trails";
import { Router } from "express";
import { Err } from "../Types";

const router = Router();

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
