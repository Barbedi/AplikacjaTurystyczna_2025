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
      return "bg-red-500/20 text-red-800 border-red-500/30";
    case "Trudna":
      return "bg-orange-500/20 text-orange-800 border-orange-500/30";
    case "Średnia":
      return "bg-yellow-500/20 text-yellow-800 border-yellow-500/30";
    case "Łatwa":
      return "bg-green-500/20 text-green-800 border-green-500/30";
    case "Bardzo łatwa":
      return "bg-blue-500/20 text-blue-800 border-blue-500/30";
    default:
      return "bg-gray-500/20 text-gray-800 border-gray-500/30";
  }
}
