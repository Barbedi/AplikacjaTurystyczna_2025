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
router.get("/crown-poland", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page as string) : undefined;
    const parsedLimit = limit ? parseInt(limit as string) : undefined;

    const result = await peaksService.getPeaksByCollectionId(
      1,
      parsedPage,
      parsedLimit,
    );
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
router.get("/crown-beskid", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page as string) : undefined;
    const parsedLimit = limit ? parseInt(limit as string) : undefined;

    const result = await peaksService.getPeaksByCollectionId(
      2,
      parsedPage,
      parsedLimit,
    );
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
 * /peaks/search:
 *   get:
 *     summary: Search peaks by name
 *     tags:
 *       - Peaks
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: Search term
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of peaks matching the search term
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Peak'
 *       400:
 *         description: Missing query parameter
 *       500:
 *         description: Server error
 */
router.get("/search", async (req, res, next) => {
  try {
    const query = req.query["query"] as string;
    if (!query) {
      throw new Err("Query parameter 'query' is required", 400);
    }

    const result = await peaksService.searchPeaks(query);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

router.post("/", async (req, res, next) => {
  try {
    const peakInfo = req.body;
    const result = await peaksService.createPeak(peakInfo);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

router.post("/:id/users", async (req, res, next) => {
  try {
    const peakId = parseInt(req.params.id);
    const { user_id } = req.body;

    if (!user_id) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const result = await peaksService.addPeakUsers(peakId, user_id);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

router.get("/users/:userId", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page as string) : undefined;
    const parsedLimit = limit ? parseInt(limit as string) : undefined;
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      throw new Err("Invalid User ID", 400);
    }

    const result = await peaksService.getPeakByUserId(
      userId,
      parsedPage,
      parsedLimit,
    );
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
      throw new Err("Invalid ID", 400);
    }

    const result = await peaksService.getPeakById(parsedId);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

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
 * /peaks/{id}/image:
 *   put:
 *     summary: Update peak image
 *     tags:
 *       - Peaks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Peak ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image_filename:
 *                 type: string
 *                 example: "1642147800123-456789.jpg"
 *     responses:
 *       200:
 *         description: Peak image updated successfully
 *       404:
 *         description: Peak not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/image", async (req, res, next) => {
  try {
    const peakId = parseInt(req.params.id);
    const { image_filename } = req.body;

    if (!image_filename) {
      res.status(400).json({ message: "Image filename is required" });
      return;
    }

    const result = await peaksService.updatePeakImage(peakId, image_filename);
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
