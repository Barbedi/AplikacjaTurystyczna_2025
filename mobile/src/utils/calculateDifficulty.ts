export function calculateDifficulty(
  distance: number,
  elevationGain: number,
  duration: number,
  selectedFeatures: string | number[],
  localFeatures: { id: number; name: string; weight: number }[],
): string {
  let score = 0;

  if (distance > 20) score += 3;
  else if (distance > 15) score += 2;
  else if (distance > 10) score += 1;

  if (elevationGain > 1500) score += 3;
  else if (elevationGain > 1000) score += 2;
  else if (elevationGain > 500) score += 1;

  if (duration > 8) score += 2;
  else if (duration > 5) score += 1;

  for (const featureId of selectedFeatures) {
    const found = localFeatures.find((f) =>
      typeof featureId === "string" ? f.name === featureId : f.id === featureId,
    );
    if (found) score += found.weight;
  }

  if (score >= 10) return "Bardzo trudna";
  if (score >= 7) return "Trudna";
  if (score >= 4) return "Średnia";
  if (score >= 2) return "Łatwa";
  return "Bardzo łatwa";
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Bardzo trudna":
      return "#ef4444";
    case "Trudna":
      return "#f97316";
    case "Średnia":
      return "#eab308";
    case "Łatwa":
      return "#22c55e";
    case "Bardzo łatwa":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
}
