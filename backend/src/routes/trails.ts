import express from "express";
import TrailsService from "../services/trails";
import { Err } from "../Types";

const router = express.Router();

// Pobierz wszystkie trasy
router.get("/", async (_req, res, next) => {
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
// Pobierz trasy utworzone przez użytkownika
router.get("/user/:userId", async (req, res, next) => {
  try {
    const {page, limit} = req.query;
   const parsedPage = page ? parseInt(page as string) : undefined;
    const parsedLimit = limit ? parseInt(limit as string) : undefined;
    const userId = req.params.userId;
    const result = await TrailsService.getTrailsByUser(userId, parsedPage, parsedLimit);
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

// Utwórz nową trasę
router.post("/", async (req, res, next) => {
  try {
    const trailData = req.body;
    const result = await TrailsService.createTrail(trailData);
    res.status(201).json({ data: result });
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

// Aktualizuj trasę
router.patch("/:id", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }
    const trailData = req.body;
    const result = await TrailsService.updateTrail(parsedId, trailData);
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

// Usuń trasę
router.delete("/:id", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }
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
