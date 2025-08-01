export function timeForWalkHours(
  distance: number,
  elevation: number,
  difficulty: number = 3,
): number {
  const distanceInMeters = distance * 1000;
  const elevationInMeters = elevation * 1000;

  const baseTime = (distanceInMeters / 1000) * 12;
  const ascentTime = (elevationInMeters / 100) * 10;
  const difficultyFactor = 0.8 + difficulty * 0.1;
  let totalMinutes = (baseTime + ascentTime) * difficultyFactor;
  totalMinutes *= 1.1;

  return totalMinutes / 60;
}

export function formatDuration(durationHours: number): string {
  const totalMinutes = Math.round(durationHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}
