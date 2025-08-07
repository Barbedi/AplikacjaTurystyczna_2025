import { Graph } from "./graph";

export type EdgeToExclude = { from: string; to: string };

class MinHeap {
  private heap: Array<{ nodeId: string; distance: number }> = [];

  push(nodeId: string, distance: number) {
    this.heap.push({ nodeId, distance });
    this.heapifyUp(this.heap.length - 1);
  }

  pop(): { nodeId: string; distance: number } | null {
    if (this.heap.length === 0) return null;

    const min = this.heap[0];
    const last = this.heap.pop();

    if (typeof last === "undefined") return null;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }

    return min ?? null;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private heapifyUp(index: number) {
    if (index === 0) return;

    const parentIndex = Math.floor((index - 1) / 2);
    const currentNode = this.heap[index];
    const parentNode = this.heap[parentIndex];

    if (
      currentNode &&
      parentNode &&
      currentNode.distance < parentNode.distance
    ) {
      [this.heap[index], this.heap[parentIndex]] = [parentNode, currentNode];
      this.heapifyUp(parentIndex);
    }
  }

  private heapifyDown(index: number) {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let smallest = index;

    const currentNode = this.heap[index];
    const leftNode = this.heap[leftChild];
    const rightNode = this.heap[rightChild];

    if (leftNode && currentNode && leftNode.distance < currentNode.distance) {
      smallest = leftChild;
    }

    const smallestNode = this.heap[smallest];
    if (
      rightNode &&
      smallestNode &&
      rightNode.distance < smallestNode.distance
    ) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      const nodeToSwap = this.heap[smallest];
      if (currentNode && nodeToSwap) {
        [this.heap[index], this.heap[smallest]] = [nodeToSwap, currentNode];
        this.heapifyDown(smallest);
      }
    }
  }
}

export function dijkstra(
  graph: Graph,
  startId: string,
  endId: string,
  edgesToExclude: EdgeToExclude[] = []
) {
  if (!graph.nodes[startId]) {
    throw new Error(`Węzeł startowy ${startId} nie istnieje w grafie`);
  }

  if (!graph.nodes[endId]) {
    throw new Error(`Węzeł końcowy ${endId} nie istnieje w grafie`);
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const heap = new MinHeap();

  for (const nodeId in graph.nodes) {
    distances[nodeId] = nodeId === startId ? 0 : Infinity;
    previous[nodeId] = null;
  }

  heap.push(startId, 0);

  while (!heap.isEmpty()) {
    const current = heap.pop();
    if (!current) break;

    const { nodeId: currentNode, distance: currentDistance } = current;

    if (visited.has(currentNode)) continue;
    if (currentNode === endId) break;

    visited.add(currentNode);

    const edges = graph.edges[currentNode];
    if (!edges || !Array.isArray(edges)) continue;

    for (const edge of edges) {
      if (!edge || typeof edge.distance !== "number" || !edge.to) continue;

      // Sprawdzenie czy krawędź jest wykluczona:
      const isExcluded = edgesToExclude.some(
        (e) => e.from === currentNode && e.to === edge.to
      );
      if (isExcluded) continue;

      const neighborId = edge.to;

      if (visited.has(neighborId)) continue;

      const newDistance = currentDistance + edge.distance;

      if (newDistance < (distances[neighborId] ?? Infinity)) {
        distances[neighborId] = newDistance;
        previous[neighborId] = currentNode;
        heap.push(neighborId, newDistance);
      }
    }
  }

  const path: string[] = [];
  let current: string | null = endId;

  if (distances[endId] === Infinity) {
    return {
      path: [],
      totalDistance: Infinity,
      found: false,
    };
  }

  while (current !== null) {
    path.unshift(current);
    current = previous[current] ?? null;
  }

  return {
    path,
    totalDistance: distances[endId] ?? Infinity,
    found: true,
  };
}
