import express from "express";
import peaksService from "../services/peaks";
import { verifyUser } from "../middlewares/verifyUser";

const router = express.Router();

/**
 * @swagger
 * /user-peaks/{userId}/{peakId}/photo:
 *   patch:
 *     summary: Update user peak photo
 *     tags:
 *       - User Peaks
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *       - name: peakId
 *         in: path
 *         required: true
 *         description: Peak ID
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               photoUrl:
 *                 type: string
 *                 example: "peak_photo_123.jpg"
 *     responses:
 *       200:
 *         description: User peak photo updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User peak not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:userId/:peakId/photo", verifyUser, async (req, res, next) => {
  try {
    const { userId, peakId } = req.params;
    const { photoUrl } = req.body;

    if (!userId || !peakId) {
      res.status(400).json({ message: "User ID and Peak ID are required" });
      return;
    }

    const result = await peaksService.updateUserPeakPhoto(
      parseInt(userId),
      parseInt(peakId),
      photoUrl,
    );

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /user-peaks/{userId}/{peakId}/verification:
 *   patch:
 *     summary: Update user peak verification status
 *     tags:
 *       - User Peaks
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *       - name: peakId
 *         in: path
 *         required: true
 *         description: Peak ID
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verified:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User peak verification status updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User peak not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:userId/:peakId/verification",
  verifyUser,
  async (req, res, next) => {
    try {
      const { userId, peakId } = req.params;
      const { verified, distance_from_peak } = req.body;

      if (!userId || !peakId) {
        res.status(400).json({ message: "User ID and Peak ID are required" });
        return;
      }

      const result = await peaksService.updateUserPeakVerification(
        parseInt(userId),
        parseInt(peakId),
        verified,
        distance_from_peak,
      );

      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
