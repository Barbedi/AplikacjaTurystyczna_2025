import { hikingGraph } from "../server";
import { findRouteThroughPoints } from "../routing-graph/findRouteThroughPoints";
import { findLoopRoute } from "../routing-graph/findLoopRoute";
import express from "express";

const router = express.Router();

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

router.post("/local", async (req: any, res: any) => {
  const { points, routeType } = req.body;


  if (!points || !Array.isArray(points) || points.length < 2) {
    return res.status(400).json({
      error: "Musisz podać tablicę punktów: co najmniej start i koniec",
    });
  }

  const finalRouteType = routeType || "one-way";
  let routePoints = [...points];
  let result;

  if (finalRouteType === "loop") {
    // Użyj specjalnej funkcji dla pętli z wykluczeniem krawędzi
    result = findLoopRoute(hikingGraph, routePoints);
  } else if (finalRouteType === "back-and-forth") {
    // Dodaj odwróconą trasę z pominięciem punktu startowego, aby trasa wracała tą samą drogą
    const reversed = [...points].slice(0, -1).reverse();
    routePoints = [...points, ...reversed];
    result = findRouteThroughPoints(hikingGraph, routePoints);
  } else {
    // Standardowa trasa one-way
    result = findRouteThroughPoints(hikingGraph, routePoints);
  }

  try {
    if (!result.found || !result.path || !Array.isArray(result.path)) {
      return res.status(404).json({
        error: "Nie znaleziono trasy przez wszystkie punkty",
      });
    }

    const nodes = result.path
      .map((id) => hikingGraph.nodes[id])
      .filter((node) => !!node);

    if (nodes.length === 0) {
      return res.status(404).json({
        error: "No valid nodes found in path",
      });
    }

    const apiKey = process.env["API_KEY"];
    if (!apiKey) {
      console.error("MapTiler API key is missing!");
      return res.status(500).json({
        error: "Missing API configuration",
      });
    }

    // Validate coordinates
    const invalidNodes = nodes.filter(
      (node) =>
        !node.lng ||
        !node.lat ||
        Math.abs(node.lng) > 180 ||
        Math.abs(node.lat) > 90 ||
        isNaN(node.lng) ||
        isNaN(node.lat),
    );

    if (invalidNodes.length > 0) {
      console.error("Invalid coordinates found:", invalidNodes);
      return res.status(400).json({
        error: "Invalid coordinates in route",
      });
    }
    const chunks = chunkArray(nodes, 50);

    let elevationResults: number[][] = [];

    for (const chunk of chunks) {
      const lngLatParam = chunk
        .map((node) => `${node.lng},${node.lat}`)
        .join(";");
      const elevationUrl = `https://api.maptiler.com/elevation/${lngLatParam}.json?key=${apiKey}`;

      const response = await fetch(elevationUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("MapTiler elevation error:", {
          status: response.status,
          statusText: response.statusText,
          url: elevationUrl.replace(apiKey, "[HIDDEN]"),
          error: errorText,
        });

        if (response.status === 401) {
          return res.status(502).json({ error: "Invalid MapTiler API key" });
        } else if (response.status === 429) {
          return res
            .status(502)
            .json({ error: "MapTiler API rate limit exceeded" });
        } else if (response.status === 400) {
          return res
            .status(502)
            .json({ error: "Invalid coordinates format for elevation API" });
        } else {
          return res
            .status(502)
            .json({
              error: `MapTiler API error: ${response.status} ${response.statusText}`,
            });
        }
      }

      const elevationData = await response.json();

      if (!Array.isArray(elevationData)) {
        console.error("Unexpected elevation response format:", elevationData);
        return res.status(502).json({ error: "Invalid elevation data format" });
      }

      const validPoints = elevationData.filter(
        (point) =>
          Array.isArray(point) &&
          point.length === 3 &&
          !isNaN(point[0]) &&
          !isNaN(point[1]) &&
          !isNaN(point[2]),
      );

      elevationResults = elevationResults.concat(validPoints);
    }

    if (elevationResults.length === 0) {
      console.error("No valid elevation data points received");
      return res
        .status(502)
        .json({ error: "No valid elevation data received" });
    }

    res.json({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: elevationResults,
          },
          properties: {
            distance: result.totalDistance,
            nodes: result.path.length,
            elevationPoints: elevationResults.length,
            routeType: finalRouteType,
          },
        },
      ],
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Route processing error:", errorMessage, err);
    res.status(500).json({ error: `Server error: ${errorMessage}` });
  }
});

export default router;
