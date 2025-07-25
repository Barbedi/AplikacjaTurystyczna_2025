import express from "express";
import reviewService from "../services/review";

const router = express.Router();

router.get("/", async (_, res,next) => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.json(reviews);
    } catch (err) {
       next(err);
    }
});

router.get("/:userId", async (req, res,next) => {
    const userId = parseInt(req.params.userId, 10);
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page as string) : undefined;
    const parsedLimit = limit ? parseInt(limit as string) : undefined;

    try {
        const reviews = await reviewService.getReviewByUserId(userId, parsedPage, parsedLimit);
        res.json(reviews);
    } catch (err) {
       next(err);
    }
});

router.post("/", async (req, res,next) => {
    const reviewData = req.body;

    try {
        const newReview = await reviewService.createReview(reviewData);
        res.status(201).json(newReview);
    } catch (err) {
       next(err);
    }
});

router.delete("/:id", async (req, res,next) => {
    const reviewId = parseInt(req.params.id, 10);

    try {
        const deletedReview = await reviewService.deleteReview(reviewId);
        res.json(deletedReview);
    } catch (err) {
       next(err);
    }
});

export default router;
