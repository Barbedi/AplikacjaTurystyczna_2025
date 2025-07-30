import { hikingGraph } from "../server";
import { findRouteThroughPoints } from "../routing-graph/findRouteThroughPoints";

import express from "express";
const router = express.Router();

router.post("/local", (req: any, res: any) => {
  const { points } = req.body;

  if (!points || !Array.isArray(points) || points.length < 2) {
    return res.status(400).json({ error: "Musisz podać tablicę punktów: co najmniej start i koniec" });
  }

  try {
    const result = findRouteThroughPoints(hikingGraph, points);

    if (!result.found) {
      return res.status(404).json({ error: "Nie znaleziono trasy przez wszystkie punkty" });
    }

    const coordinates = result.path
      .map((id) => hikingGraph.nodes[id])
      .filter((node) => !!node)
      .map((node) => [node.lng, node.lat]);

    return res.json({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates,
          },
          properties: {
            distance: result.totalDistance,
            nodes: result.path.length,
          },
        },
      ],
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
});


export default router;