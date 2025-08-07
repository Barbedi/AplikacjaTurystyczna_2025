import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import communityTrailsService from "../services/communitytrails";

router.post("/", verifyUser, async (req, res, next) => {
  const { trailId, description } = req.body;
  const userId = (req.user as { id: number }).id;

  try {
    const newTrail = await communityTrailsService.createCommunityTrail(
      userId,
      trailId,
      description,
    );
    res.status(201).json(newTrail);
  } catch (error) {
    next(error);
  }
});

router.get("/", verifyUser, async (_, res, next) => {
  try {
    const trails = await communityTrailsService.getCommunityTrails();
    res.status(200).json(trails);
  } catch (error) {
    next(error);
  }
});
router.get("/:sharedId", verifyUser, async (req, res, next) => {
  const sharedId = parseInt(req.params["sharedId"] || "0", 10);
  try {
    const trail =
      await communityTrailsService.getCommunityTrailsBySharedId(sharedId);
    res.status(200).json(trail);
  } catch (error) {
    next(error);
  }
});

router.delete("/:sharedId", verifyUser, async (req, res, next) => {
  const sharedId = parseInt(req.params["sharedId"] || "0", 10);
  try {
    await communityTrailsService.deleteCommunityTrail(sharedId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
