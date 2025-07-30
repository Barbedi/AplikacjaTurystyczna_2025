import { hikingGraph } from "../server";
import { findRouteThroughPoints } from "../routing-graph/findRouteThroughPoints";

import express from "express";
const router = express.Router();

router.post("/local", async (req: any, res: any) => {
  const { points } = req.body;

  if (!points || !Array.isArray(points) || points.length < 2) {
    return res.status(400).json({ error: "Musisz podać tablicę punktów: co najmniej start i koniec" });
  }

  try {
    const result = findRouteThroughPoints(hikingGraph, points);

    if (!result.found) {
      return res.status(404).json({ error: "Nie znaleziono trasy przez wszystkie punkty" });
    }
    const nodes = result.path
      .map((id) => hikingGraph.nodes[id])
      .filter((node) => !!node);

    const locations = nodes.map((node) => ({
      latitude: node.lat,
      longitude: node.lng,
    }));
    const elevationResponse = await fetch("https://api.open-elevation.com/api/v1/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locations }),
    });

    if (!elevationResponse.ok) {
      return res.status(502).json({ error: "Błąd podczas pobierania wysokości" });
    }

    const elevationData = await elevationResponse.json();

    const coordsWithElevation = elevationData.results.map(
      ({ longitude, latitude, elevation }: any) => [longitude, latitude, elevation]
    );


    res.json({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: coordsWithElevation,
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
