import express from "express";
import FeaturesList from "../services/FeaturesList";
import { Err } from "../Types";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const features = await FeaturesList.getAll();
    res.json(features);
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id)) {
    return next(new Err("Invalid feature ID", 400));
  }

  try {
    const feature = await FeaturesList.getById(id);
    res.json(feature);
  } catch (error) {
    next(error);
  }
});

router.post("/:trailId/update", async (req, res, next) => {
  const trailId = parseInt(req.params["trailId"] as string, 10);
  const { featureIds } = req.body;

  if (isNaN(trailId) || !Array.isArray(featureIds)) {
    return next(new Err("Invalid trail ID or feature IDs", 400));
  }

  try {
    const result = await FeaturesList.updateTrailFeatures(trailId, featureIds);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
