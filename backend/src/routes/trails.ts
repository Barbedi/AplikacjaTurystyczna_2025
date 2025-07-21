import express from "express";
import TrailsService from "../services/trails";
import TrailPointsService from "../services/trailsPoint";
import { Err } from "../Types";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page as string) : 1;
    const parsedLimit = limit ? parseInt(limit as string) : 7;
    
    const result = await TrailsService.getTrailsByPublic(parsedPage, parsedLimit);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

// Route for getting all trails (admin use)
router.get("/all", async (_req, res, next) => {
  try {
    const result = await TrailsService.getAllTrails();
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

// Route for getting random public trails
router.get("/random", async (req, res, next) => {
  try {
    const { limit } = req.query;
    const parsedLimit = limit ? parseInt(limit as string) : 3;
    
    const result = await TrailsService.getRandomPublicTrails(parsedLimit);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

router.get("/user/:userId", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page as string) : undefined;
    const parsedLimit = limit ? parseInt(limit as string) : undefined;
    const userId = req.params.userId;
    const result = await TrailsService.getTrailsByUser(
      userId,
      parsedPage,
      parsedLimit,
    );
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }
    const result = await TrailsService.getTrailById(parsedId);
    if (!result) {
      throw new Err("Trasa nie znaleziona", 404);
    }
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { points, ...trailData } = req.body;

    const result = await TrailsService.createTrail(trailData);

    if (points && Array.isArray(points) && points.length > 0) {
      const parsedPoints = points.map((p: any, i: number) => ({
        lat: p.coordinates[0],
        lng: p.coordinates[1],
        name: p.name || null,
        point_order: i,
      }));

      await TrailPointsService.addPointsForTrail(result.id, parsedPoints);
    }

    res.status(201).json({ data: result });
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }

    const { points, ...trailData } = req.body;

    const result = await TrailsService.updateTrail(parsedId, trailData);
    if (!result) {
      throw new Err("Trasa nie znaleziona", 404);
    }

    if (points && Array.isArray(points)) {
      await TrailPointsService.deletePointsByTrailId(parsedId);

      if (points.length > 0) {
        const parsedPoints = points.map((p: any, i: number) => ({
          lat: p.coordinates[0],
          lng: p.coordinates[1],
          name: p.name || null,
          point_order: i,
        }));

        await TrailPointsService.addPointsForTrail(parsedId, parsedPoints);
      }
    }

    res.status(200).json({ data: result });
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }

    await TrailPointsService.deletePointsByTrailId(parsedId);

    await TrailsService.deleteTrail(parsedId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

export default router;
