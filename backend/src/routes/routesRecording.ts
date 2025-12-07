import express from "express";
import RouteRecordingService from "../services/routeRecording";
import { Err } from "../Types";

const router = express.Router();

/**
 * @swagger
 * /gps/user/{userId}:
 *   get:
 *     tags:
 *       - GPS Routes
 *     summary: Get all recorded routes for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user GPS recordings
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/user/:userId", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) throw new Err("Invalid user ID", 400);

    const result = await RouteRecordingService.getRoutesByUser(userId);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else next(error);
  }
});

/**
 * @swagger
 * /gps/{routeId}:
 *   get:
 *     tags:
 *       - GPS Routes
 *     summary: Get route details with all GPS points
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Full route data with points
 *       404:
 *         description: Route not found
 */
router.get("/:routeId", async (req, res, next) => {
  try {
    const routeId = parseInt(req.params.routeId, 10);
    if (isNaN(routeId)) throw new Err("Invalid route ID", 400);

    const result = await RouteRecordingService.getRouteById(routeId);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else next(error);
  }
});

/**
 * @swagger
 * /gps/{routeId}:
 *   delete:
 *     tags:
 *       - GPS Routes
 *     summary: Delete a recorded GPS route
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *       - in: query
 *         name: userId
 *         required: true
 *     responses:
 *       204:
 *         description: Route deleted
 *       403:
 *         description: Forbidden
 */
router.delete("/:routeId", async (req, res, next) => {
  try {
    const routeId = parseInt(req.params.routeId, 10);

    const userIdRaw = req.query["userId"];     // ✔ zgodne z TS
    const userId = parseInt(userIdRaw as string, 10);

    if (isNaN(routeId)) throw new Err("Invalid route ID", 400);
    if (isNaN(userId)) throw new Err("Invalid user ID", 400);

    await RouteRecordingService.deleteRoute(routeId, userId);

    res.status(204).send();
  } catch (error) {
    if (error instanceof Err) {
      res.status(error.statusCode || 500).json({ message: error.message });
    } else next(error);
  }
});


export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     GpsPoint:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *         lon:
 *           type: number
 *         altitude:
 *           type: number
 *         ts:
 *           type: number
 *         geometry:
 *           type: object
 *     GpsRoute:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         name:
 *           type: string
 *         created_at:
 *           type: string
 *         finished_at:
 *           type: string
 *         distance_m:
 *           type: number
 *         duration_ms:
 *           type: number
 *         elevation_gain:
 *           type: number
 *         elevation_loss:
 *           type: number
 *         max_speed:
 *           type: number
 *         avg_speed:
 *           type: number
 *         points:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GpsPoint'
 */
