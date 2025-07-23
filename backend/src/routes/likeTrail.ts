import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import likeTrail from "../services/likeTrail";

router.post("/:sharedTrailId", verifyUser, async (req, res, next) => {
  const userId = (req.user as { id: number }).id;
  const sharedTrailId = parseInt(req.params["sharedTrailId"] as string, 10);

  try {
    const result = await likeTrail.likeTrail(userId, sharedTrailId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:sharedTrailId", verifyUser, async (req, res, next) => {
  const userId = (req.user as { id: number }).id;
  const sharedTrailId = parseInt(req.params["sharedTrailId"] as string, 10);

  try {
    const result = await likeTrail.unlikeTrail(userId, sharedTrailId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
router.get("/:sharedTrailId", verifyUser, async (req, res, next) => {
  const userId = (req.user as { id: number }).id;
  const sharedTrailId = parseInt(req.params["sharedTrailId"] as string, 10);

  try {
    const result = await likeTrail.getLikesInfo(sharedTrailId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
