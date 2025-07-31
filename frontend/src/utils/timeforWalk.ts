export function timeForWalk(distance: number, elevation: number): string {
  const timeInMinutes = (distance / 5) * 60 + (elevation / 300) * 60;
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = Math.round(timeInMinutes % 60);

  return `${hours}h ${minutes}m`;
}