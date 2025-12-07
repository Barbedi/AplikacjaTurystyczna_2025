import express from "express";
import peaksService from "../services/peaks";
import { Err } from "../Types";
import { verifyPeakPhoto } from "../utils/verifyPeakPhoto";
import path from "path";

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
    const { page, limit, all } = req.query;
    const parsedPage = page ? parseInt(page as string) : 1;
    const parsedLimit = limit ? parseInt(limit as string) : 6;
    const allFlag = all === "true"; // ✅ jawne przekształcenie

    const result = await peaksService.getPeaksByCollectionId(
      1,
      parsedPage,
      parsedLimit,
      allFlag, // ✅ przekazujesz do środka
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
    const { page, limit,all } = req.query;
    const parsedPage = page ? parseInt(page as string) : undefined;
    const parsedLimit = limit ? parseInt(limit as string) : undefined;
    const allFlag = all === "true"; // ✅ jawne przekształcenie

    const result = await peaksService.getPeaksByCollectionId(
      2,
      parsedPage,
      parsedLimit,
      allFlag, // ✅ przekazujesz do środka
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

/**
 * @swagger
 * /peaks/verify-photo:
 *   post:
 *     summary: Verify peak photo by GPS coordinates
 *     tags:
 *       - Peaks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *               - peak_id
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Uploaded image filename
 *                 example: "peak_1234567890.jpg"
 *               peak_id:
 *                 type: number
 *                 description: Peak ID to verify against
 *                 example: 1
 *     responses:
 *       200:
 *         description: Photo verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 verified:
 *                   type: boolean
 *                   description: Whether photo is verified (within 1000m)
 *                 distance:
 *                   type: number
 *                   description: Distance from peak in meters
 *                 error:
 *                   type: string
 *                   description: Error message if verification failed
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: Peak not found or image file not found
 *       500:
 *         description: Server error
 */
router.post("/verify-photo", async (req, res, next) => {
  console.log("🔍 POST /peaks/verify-photo HIT");
  console.log("📦 Request body:", req.body);
  
  try {
    const { filename, peak_id } = req.body;

    if (!filename || !peak_id) {
      console.log("❌ Missing parameters:", { filename, peak_id });
      res.status(400).json({ 
        message: "Missing required parameters: filename and peak_id" 
      });
      return;
    }
    
    console.log("✅ Parameters OK:", { filename, peak_id });

    // Pobierz dane szczytu
    const peakResult = await peaksService.getPeakById(peak_id);
    const peak = peakResult.data;
    console.log("🏔️ Peak data:", { 
      id: peak?.id, 
      name: peak?.name, 
      lat: peak?.latitude, 
      lon: peak?.longitude 
    });

    if (!peak || !peak.latitude || !peak.longitude) {
      console.log("❌ Peak missing coordinates");
      res.status(404).json({ 
        message: "Peak not found or missing GPS coordinates" 
      });
      return;
    }

    // Ścieżka do pliku zdjęcia (w kontenerze pliki są w dist/files/peaks)
    const imagePath = path.join(__dirname, "../files/peaks", filename);
    console.log("📁 Image path:", imagePath);

    // Weryfikacja zdjęcia
    console.log("🔍 Calling verifyPeakPhoto with:", {
      imagePath,
      peakLat: peak.latitude,
      peakLon: peak.longitude,
      maxDistance: 1000
    });
    const result = await verifyPeakPhoto(
      imagePath,
      peak.latitude,
      peak.longitude,
      1000 // max 1000m
    );
    console.log("📊 verifyPeakPhoto result:", result);

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
