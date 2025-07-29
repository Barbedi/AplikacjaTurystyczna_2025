import express from "express";
const router = express.Router();
import logs from "../services/logs";


router.get("/:userId", async (req, res, next) => {
    const userId = parseInt(req.params.userId, 10);
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page as string) : undefined;
    const parsedLimit = limit ? parseInt(limit as string) : undefined;
    try {
        const result = await logs.getUserActivities(userId, parsedPage, parsedLimit);
        res.json(result);
    } catch (error) {
        next(error);
    }
});


export default router;