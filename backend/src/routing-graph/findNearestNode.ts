import { Graph } from "./graph";
import { haversine } from "../routing-graph/haversine";

export function findNearestNode(
  lat: number,
  lng: number,
  graph: Graph,
): string {
  let nearestId = "";
  let minDist = Infinity;

  // Sprawdź czy graf ma węzły
  const nodeIds = Object.keys(graph.nodes);
  if (nodeIds.length === 0) {
    throw new Error("Graf nie zawiera żadnych węzłów");
  }

  for (const nodeId of nodeIds) {
    const node = graph.nodes[nodeId];
    if (!node || typeof node.lat !== "number" || typeof node.lng !== "number") {
      continue;
    }

    // Użyj haversine dla większej dokładności
    const dist = haversine(lat, lng, node.lat, node.lng);

    if (dist < minDist) {
      minDist = dist;
      nearestId = nodeId;
    }
  }

  if (!nearestId) {
    throw new Error("Nie znaleziono żadnego prawidłowego węzła w grafie");
  }

  return nearestId;
}
