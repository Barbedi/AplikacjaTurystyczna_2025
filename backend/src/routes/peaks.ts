import express from "express";
import peaksService from "../services/peaks";
import { Err } from "../Types";

const router = express.Router();

/**
 * @swagger
 * /peaks:
 *   get:
 *     summary: Get all peaks
 *     tags:
 *       - Peaks
 *     responses:
 *       200:
 *         description: List of all peaks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Peak'
 *       404:
 *         description: No peaks found
 *       500:
 *         description: Server error
 */
router.get("/", async (_req, res, next) => {
  try {
    const result = await peaksService.getPeaks();
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error); 
    }
  }
});

/**
 * @swagger
 * /peaks/{id}:
 *   get:
 *     summary: Get peak by ID
 *     tags:
 *       - Peaks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the peak to retrieve
 *     responses:
 *       200:
 *         description: Peak details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peak'
 *       404:
 *         description: Peak not found
 *       500: 
 *         description: Server error
 */


/**
 * @swagger
 * /peaks/{id}:
 *   patch:
 *     summary: Update peak information
 *     tags:
 *       - Peaks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the peak to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               elevation:
 *                 type: number
 *               region:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               verified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Peak updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peak'
 *       400:
 *         description: Invalid ID or request body
 *       404:
 *         description: Peak not found
 *       500:
 *         description: Server error
 */


router.patch("/:id", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Invalid ID", 400);
    }

    const peakInfo = req.body;
    const result = await peaksService.updatePeak(parsedId, peakInfo);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});




/**
 * @swagger
 * /peaks/crown-poland:
 *   get:
 *     summary: Get all peaks from the Crown of Poland collection
 *     tags:
 *       - Peaks
 *     responses:
 *       200:
 *         description: List of peaks from the Crown of Poland collection
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Peak'
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Server error
 */
router.get("/crown-poland", async (_req, res, next) => {
  try {
    const result = await peaksService.getPeaksByCollectionId(1);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});





/**
 * @swagger
 * /peaks/crown-beskid:
 *   get:
 *     summary: Get all peaks from the Crown of Beskid collection
 *     tags:
 *       - Peaks
 *     responses:
 *       200:
 *         description: List of peaks from the Crown of Beskid collection
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Peak'
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Server error
 */
router.get("/crown-beskid", async (_req, res, next) => {
  try {
    const result = await peaksService.getPeaksByCollectionId(2);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});


export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Peak:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Rysy
 *         elevation:
 *           type: number
 *           example: 2499
 *         region:
 *           type: string
 *           example: Tatry
 *         latitude:
 *           type: number
 *           format: float
 *           example: 49.1794
 *         longitude:
 *           type: number
 *           format: float
 *           example: 20.0886
 *         verified:
 *           type: boolean
 *           example: true
 */


