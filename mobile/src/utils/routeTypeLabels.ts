type RouteType = "one-way" | "back-and-forth" | "loop";

export function getRouteTypeLabel(routeType: RouteType): string {
  return routeTypeLabels[routeType];
}

export const routeTypeLabels: Record<RouteType, string> = {
  "one-way": "W jedną stronę",
  "back-and-forth": "W tą i z powrotem",
  loop: "Pętla",
};
