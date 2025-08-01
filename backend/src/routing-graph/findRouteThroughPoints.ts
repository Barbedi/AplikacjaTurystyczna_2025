import { findNearestNode } from "../routing-graph/findNearestNode";
import { dijkstra } from "../routing-graph/dijkstra";
import { Graph } from "./graph";

interface Point {
  lat: number;
  lng: number;
}

function findRouteThroughPoints(graph: Graph, points: Point[]) {
  if (points.length < 2) throw new Error("Co najmniej 2 punkty wymagane");

  let fullPath: string[] = [];
  let totalDistance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    // Sprawdź czy punkty są zdefiniowane
    const startPoint = points[i];
    const endPoint = points[i + 1];

    if (!startPoint || !endPoint) {
      return { found: false, path: [], totalDistance: Infinity };
    }

    // Znajdź najbliższe węzły do punktów
    const startId = findNearestNode(startPoint.lat, startPoint.lng, graph);
    const endId = findNearestNode(endPoint.lat, endPoint.lng, graph);

    if (startId === undefined || endId === undefined) {
      return { found: false, path: [], totalDistance: Infinity };
    }

    const result = dijkstra(graph, startId, endId);
    if (!result.found) {
      return { found: false, path: [], totalDistance: Infinity };
    }

    if (i === 0) {
      fullPath = result.path;
    } else {
      fullPath = fullPath.concat(result.path.slice(1));
    }

    totalDistance += result.totalDistance;
  }

  return { found: true, path: fullPath, totalDistance };
}

export { findRouteThroughPoints };
