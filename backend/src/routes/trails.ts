import express from "express";
import TrailsService from "../services/trails";
import TrailPointsService from "../services/trailsPoint";
import { Err } from "../Types";

const router = express.Router();

/**
 * @swagger
 * /trails:
 *   get:
 *     tags:
 *       - Trails
 *     summary: Get all public trails with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page (default is 7)
 *     responses:
 *       200:
 *         description: List of public trails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trail'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page as string) : 1;
    const parsedLimit = limit ? parseInt(limit as string) : 7;

    const result = await TrailsService.getTrailsByPublic(
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
 * /trails/all:
 *   get:
 *     summary: Get all trails (admin use)
 *     tags:
 *       - Trails
 *     responses:
 *       200:
 *         description: List of all trails including non-public ones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trail'
 *       500:
 *         description: Server error
 */
router.get("/all", async (_req, res, next) => {
  try {
    const result = await TrailsService.getAllTrails();
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
 * /trails/random:
 *   get:
 *     summary: Get random public trails
 *     tags:
 *       - Trails
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of random trails to return (default is 3)
 *     responses:
 *       200:
 *         description: List of random public trails
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trail'
 *       500:
 *         description: Server error
 */
router.get("/random", async (req, res, next) => {
  try {
    const { limit } = req.query;
    const parsedLimit = limit ? parseInt(limit as string) : 3;

    const result = await TrailsService.getRandomPublicTrails(parsedLimit);
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
 * /trails/user/{userId}:
 *   get:
 *     summary: Get trails by user ID
 *     tags:
 *       - Trails
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of trails created by the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trail'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get("/user/:userId", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page as string) : undefined;
    const parsedLimit = limit ? parseInt(limit as string) : undefined;
    const userId = req.params.userId;
    const result = await TrailsService.getTrailsByUser(
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
 * /trails/{id}:
 *   get:
 *     summary: Get trail by ID
 *     tags:
 *       - Trails
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trail ID
 *     responses:
 *       200:
 *         description: Trail details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trail'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Trail not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }
    const result = await TrailsService.getTrailById(parsedId);
    if (!result) {
      throw new Err("Trasa nie znaleziona", 404);
    }
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else {
      next(error);
    }
  }
});


router.get("/region/:region", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = page ? parseInt(page as string) : 1;
    const parsedLimit = limit ? parseInt(limit as string) : 6;
    const region = req.params.region;

    const result = await TrailsService.getTrailsByRegion(
      region,
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
 * /trails/{id}/photos:
 *   get:
 *     summary: Get photos for a trail
 *     tags:
 *       - Trails
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trail ID
 *     responses:
 *       200:
 *         description: List of photos for the trail
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["trail1.jpg", "trail2.jpg"]
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Server error
 */
router.get("/:id/photos", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }
    const photos = await TrailsService.getTrailPhotos(parsedId);
    res.status(200).json(photos);
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
 * /trails:
 *   post:
 *     summary: Create a new trail
 *     tags:
 *       - Trails
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Szlak do Morskiego Oka"
 *               description:
 *                 type: string
 *                 example: "Popularny szlak prowadzący do jeziora Morskie Oko w Tatrach"
 *               distance:
 *                 type: number
 *                 example: 9.3
 *               elevation_gain:
 *                 type: number
 *                 example: 400
 *               difficulty:
 *                 type: string
 *                 enum: ['łatwy', 'średni', 'trudny']
 *                 example: "średni"
 *               estimated_time:
 *                 type: integer
 *                 example: 240
 *               user_id:
 *                 type: string
 *                 example: "user123"
 *               is_public:
 *                 type: boolean
 *                 example: true
 *               points:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Start trasy"
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: number
 *                       example: [49.1794, 20.0886]
 *     responses:
 *       201:
 *         description: Trail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Trail'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res, next) => {
  try {
    const { points, ...trailData } = req.body;

    const result = await TrailsService.createTrail(trailData);

    if (points && Array.isArray(points) && points.length > 0) {
      const parsedPoints = points.map((p: any, i: number) => ({
        lat: p.coordinates[0],
        lng: p.coordinates[1],
        name: p.name || null,
        point_order: i,
      }));

      await TrailPointsService.addPointsForTrail(result.id, parsedPoints);
    }

    res.status(201).json({ data: result });
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
 * /trails/{id}:
 *   patch:
 *     summary: Update a trail
 *     tags:
 *       - Trails
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trail ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               distance:
 *                 type: number
 *               elevation_gain:
 *                 type: number
 *               difficulty:
 *                 type: string
 *                 enum: ['łatwy', 'średni', 'trudny']
 *               estimated_time:
 *                 type: integer
 *               user_id:
 *                 type: string
 *               is_public:
 *                 type: boolean
 *               points:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: number
 *     responses:
 *       200:
 *         description: Trail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Trail'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Trail not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }

    const { points, ...trailData } = req.body;

    const result = await TrailsService.updateTrail(parsedId, trailData);
    if (!result) {
      throw new Err("Trasa nie znaleziona", 404);
    }

    if (points && Array.isArray(points)) {
      await TrailPointsService.deletePointsByTrailId(parsedId);

      if (points.length > 0) {
        const parsedPoints = points.map((p: any, i: number) => ({
          lat: p.coordinates[0],
          lng: p.coordinates[1],
          name: p.name || null,
          point_order: i,
        }));

        await TrailPointsService.addPointsForTrail(parsedId, parsedPoints);
      }
    }

    res.status(200).json({ data: result });
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
 * /trails/{id}:
 *   delete:
 *     summary: Delete a trail
 *     tags:
 *       - Trails
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trail ID
 *     responses:
 *       204:
 *         description: Trail deleted successfully
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }

    await TrailPointsService.deletePointsByTrailId(parsedId);

    await TrailsService.deleteTrail(parsedId);
    res.status(204).send();
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
 * /trails/{id}/photos/{photoName}:
 *   delete:
 *     summary: Delete a trail photo
 *     tags:
 *       - Trails
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trail ID
 *       - in: path
 *         name: photoName
 *         required: true
 *         schema:
 *           type: string
 *         description: Photo file name
 *     responses:
 *       204:
 *         description: Photo deleted successfully
 *       400:
 *         description: Invalid ID or photo name
 *       500:
 *         description: Server error
 */
router.delete("/:id/photos/:photoName", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }

    const { photoName } = req.params;
    if (!photoName) {
      throw new Err("Nieprawidłowa nazwa zdjęcia", 400);
    }

    await TrailsService.deleteTrailPhoto(parsedId, photoName);
    res.status(204).send();
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
 * /trails/{id}/photos:
 *   patch:
 *     summary: Update trail photos
 *     tags:
 *       - Trails
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *             example: ["trail1.jpg", "trail2.jpg"]
 *     responses:
 *       200:
 *         description: Photos updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid ID or data format
 *       500:
 *         description: Server error
 */
router.patch("/:id/photos", async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
      throw new Err("Nieprawidłowe ID", 400);
    }

    const photos = req.body;
    if (!Array.isArray(photos)) {
      throw new Err("Nieprawidłowy format danych zdjęć", 400);
    }

    const result = await TrailsService.updateTrailPhotos(parsedId, photos);
    res
      .status(200)
      .json({ message: "Photos updated successfully", data: result });
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
 *     TrailPoint:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         trail_id:
 *           type: integer
 *           example: 2
 *         lat:
 *           type: number
 *           format: float
 *           example: 49.1794
 *         lng:
 *           type: number
 *           format: float
 *           example: 20.0886
 *         name:
 *           type: string
 *           example: "Start trasy"
 *         point_order:
 *           type: integer
 *           example: 0
 *     Trail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Szlak do Morskiego Oka"
 *         description:
 *           type: string
 *           example: "Popularny szlak prowadzący do jeziora Morskie Oko w Tatrach"
 *         distance:
 *           type: number
 *           format: float
 *           example: 9.3
 *         elevation_gain:
 *           type: number
 *           format: float
 *           example: 400
 *         difficulty:
 *           type: string
 *           enum: ['łatwy', 'średni', 'trudny']
 *           example: "średni"
 *         estimated_time:
 *           type: integer
 *           example: 240
 *         user_id:
 *           type: string
 *           example: "user123"
 *         is_public:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           example: ["trail1.jpg", "trail2.jpg"]
 */
