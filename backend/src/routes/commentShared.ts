import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import commentSharedService from "../services/commentShared";

router.get("/:sharedTrailId", verifyUser, async (req, res, next) => {
  const sharedTrailId = parseInt(req.params["sharedTrailId"] || "0", 10);
  try {
    const comments =
      await commentSharedService.getCommentsBySharedTrailId(sharedTrailId);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyUser, async (req, res, next) => {
  const comment = req.body;
  try {
    const newComment = await commentSharedService.addComment(comment);
    res.status(201).send(newComment);
  } catch (error) {
    next(error);
  }
});

router.delete("/:commentId", verifyUser, async (req, res, next) => {
  const commentId = parseInt(req.params["commentId"] || "0", 10);
  try {
    const deletedComment = await commentSharedService.deleteComment(commentId);
    res.status(200).json(deletedComment);
  } catch (error) {
    next(error);
  }
});

export default router;
