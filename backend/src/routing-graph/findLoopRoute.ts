import { findNearestNode } from "../routing-graph/findNearestNode";
import { dijkstra, EdgeToExclude } from "../routing-graph/dijkstra";
import { Graph } from "./graph";

interface Point {
  lat: number;
  lng: number;
}

function findLoopRoute(graph: Graph, points: Point[]) {
  if (points.length < 2) throw new Error("Co najmniej 2 punkty wymagane");

  let fullPath: string[] = [];
  let totalDistance = 0;
  let usedEdges: EdgeToExclude[] = [];

  // Pierwsza część trasy - od punktu do punktu normalnie
  for (let i = 0; i < points.length - 1; i++) {
    const startPoint = points[i];
    const endPoint = points[i + 1];

    if (!startPoint || !endPoint) {
      return { found: false, path: [], totalDistance: Infinity };
    }

    const startId = findNearestNode(startPoint.lat, startPoint.lng, graph);
    const endId = findNearestNode(endPoint.lat, endPoint.lng, graph);

    if (startId === undefined || endId === undefined) {
      return { found: false, path: [], totalDistance: Infinity };
    }

    const result = dijkstra(graph, startId, endId, usedEdges);
    if (!result.found) {
      return { found: false, path: [], totalDistance: Infinity };
    }

    // Dodaj użyte krawędzie do listy wykluczeń (w obu kierunkach)
    for (let j = 0; j < result.path.length - 1; j++) {
      const from = result.path[j];
      const to = result.path[j + 1];
      if (from && to) {
        usedEdges.push({ from, to });
        usedEdges.push({ from: to, to: from }); // Dwukierunkowe wykluczenie
      }
    }

    if (i === 0) {
      fullPath = result.path;
    } else {
      fullPath = fullPath.concat(result.path.slice(1));
    }

    totalDistance += result.totalDistance;
  }

  // Jeśli to pętla, znajdź drogę powrotną z wykluczeniem użytych krawędzi
  if (points.length >= 2) {
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];

    if (!lastPoint || !firstPoint) {
      return { found: false, path: [], totalDistance: Infinity };
    }

    // Sprawdź czy ostatni punkt nie jest już tym samym co pierwszy
    const isSamePoint =
      Math.abs(lastPoint.lat - firstPoint.lat) < 0.0001 &&
      Math.abs(lastPoint.lng - firstPoint.lng) < 0.0001;

    if (!isSamePoint) {
      const lastId = findNearestNode(lastPoint.lat, lastPoint.lng, graph);
      const firstId = findNearestNode(firstPoint.lat, firstPoint.lng, graph);

      if (lastId !== undefined && firstId !== undefined) {
        // Znajdź drogę powrotną z wykluczeniem użytych krawędzi
        const returnResult = dijkstra(graph, lastId, firstId, usedEdges);
        
        if (returnResult.found) {
          // Dodaj drogę powrotną (bez pierwszego węzła żeby uniknąć duplikacji)
          fullPath = fullPath.concat(returnResult.path.slice(1));
          totalDistance += returnResult.totalDistance;
        } else {
          // Jeśli nie można znaleźć alternatywnej drogi, użyj standardowej
          console.log("Nie znaleziono alternatywnej drogi powrotnej, używam standardowej");
          const fallbackResult = dijkstra(graph, lastId, firstId);
          if (fallbackResult.found) {
            fullPath = fullPath.concat(fallbackResult.path.slice(1));
            totalDistance += fallbackResult.totalDistance;
          } else {
            return { found: false, path: [], totalDistance: Infinity };
          }
        }
      }
    }
  }

  return { found: true, path: fullPath, totalDistance };
}

export { findLoopRoute };
