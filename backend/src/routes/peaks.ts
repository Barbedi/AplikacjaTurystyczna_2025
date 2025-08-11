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

/**
 * @swagger
 * /peaks:
 *   post:
 *     summary: Create a new peak
 *     tags:
 *       - Peaks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rysy"
 *               elevation:
 *                 type: number
 *                 example: 2499
 *               region:
 *                 type: string
 *                 example: "Tatry"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 49.1794
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 20.0886
 *     responses:
 *       201:
 *         description: Peak created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /peaks/{id}/users:
 *   post:
 *     summary: Add a user to a peak
 *     tags:
 *       - Peaks
 *     parameters:
 *       - name: id
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
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: "Climbed on a sunny day"
 *               photo_url:
 *                 type: string
 *                 example: "https://example.com/photo.jpg"
 *           responses:
 *       201:
 *         description: User added to peak successfully
 *       400:
 *         description: Bad request (e.g., missing user_id)
 *       404:
 *         description: Peak not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/users", async (req, res, next) => {
  try {
    const peakId = parseInt(req.params.id);
    const { user_id, description, photo_url } = req.body;

    if (!user_id) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const result = await peaksService.addPeakUsers(
      peakId,
      user_id,
      description,
      photo_url,
    );
    res.status(201).json(result);
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
 * /peaks/users/{userId}:
 *   get:
 *     summary: Get peaks climbed by a user
 *     tags:
 *       - Peaks
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of peaks climbed by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Peak'
 *       404:
 *         description: User not found or no peaks climbed
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /peaks/{id}/users/{userId}:
 *   get:
 *     summary: Get a specific peak climbed by a user
 *     tags:
 *       - Peaks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Peak ID
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Peak details for the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peak'
 *       404:
 *         description: Peak or user not found
 *       500:
 *         description: Internal server error
 */

router.get("/:id/users/:userId", async (req, res, next) => {
  try {
    const peakId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    if (isNaN(peakId) || isNaN(userId)) {
      throw new Err("Invalid ID", 400);
    }

    const result = await peaksService.getUserPeakById(userId, peakId);
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
 *       - name: id
 *         in: path
 *         required: true
 *         description: Peak ID
 *         schema:
 *           type: integer
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
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /peaks/{id}/photos:
 *   get:
 *     summary: Get all photos for a specific peak
 *     tags:
 *       - Peaks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Peak ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of photos for the peak
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       photo_url:
 *                         type: string
 *                       visited_at:
 *                         type: string
 *                         format: date
 *                       description:
 *                         type: string
 *                       user_email:
 *                         type: string
 *       404:
 *         description: Peak not found
 *       500:
 *         description: Internal server error
 */

router.get("/:id/photos", async (req, res, next) => {
  try {
    const peakId = parseInt(req.params.id);
    if (isNaN(peakId)) {
      throw new Err("Invalid ID", 400);
    }

    const result = await peaksService.getPeakPhotos(peakId);
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
 *   patch:
 *     summary: Update peak by ID
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
 *               name:
 *                 type: string
 *                 example: "Rysy"
 *               elevation:
 *                 type: number
 *                 example: 2499
 *               region:
 *                 type: string
 *                 example: "Tatry"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 49.1794
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 20.0886
 *     responses:
 *         200:
 *           description: Peak updated successfully
 *         400:
 *           description: Bad request (e.g., missing required fields)
 *         404:
 *           description: Peak not found
 *         500:
 *           description: Internal server error
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
export default router;
