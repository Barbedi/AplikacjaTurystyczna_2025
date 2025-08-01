export type Node = {
  id: string;
  lat: number;
  lng: number;
};

export type Edge = {
  to: string;
  distance: number;
};

export type Graph = {
  nodes: Record<string, Node>;
  edges: Record<string, Edge[]>;
};
