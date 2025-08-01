import fs from "fs";
import path from "path";
import { Graph, Node, Edge } from "./graph";
import { haversine } from "./haversine";

export function parseGeoJSON(filePath: string): Graph {
  const rawData = fs.readFileSync(path.resolve(filePath), "utf-8");
  const geojson = JSON.parse(rawData);

  const nodes: Record<string, Node> = {};
  const edges: Record<string, Edge[]> = {};

  for (const feature of geojson.features) {
    if (
      feature.geometry.type !== "LineString" ||
      !Array.isArray(feature.geometry.coordinates)
    ) {
      continue;
    }

    const coords: number[][] = feature.geometry.coordinates;

    for (let i = 0; i < coords.length - 1; i++) {
      const [lng1, lat1] = coords[i] as [number, number];
      const [lng2, lat2] = coords[i + 1] as [number, number];

      const fromId = `${lat1},${lng1}`;
      const toId = `${lat2},${lng2}`;

      if (!nodes[fromId]) {
        nodes[fromId] = { id: fromId, lat: lat1, lng: lng1 };
      }
      if (!nodes[toId]) {
        nodes[toId] = { id: toId, lat: lat2, lng: lng2 };
      }

      const distance = haversine(lat1, lng1, lat2, lng2);

      if (!edges[fromId]) edges[fromId] = [];
      if (!edges[toId]) edges[toId] = [];

      edges[fromId].push({ to: toId, distance });
      edges[toId].push({ to: fromId, distance });
    }
  }

  return { nodes, edges };
}
