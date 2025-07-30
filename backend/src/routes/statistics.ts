import express from "express";
import statisticsService from "../services/statistics";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const statistics = await statisticsService.getStatisticsForUser(
      parseInt(userId, 10),
    );
    res.json(statistics);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
