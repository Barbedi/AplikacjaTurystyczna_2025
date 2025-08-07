export function calculateDistance(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
): number {
  const earthRadiusMeters = 6371e3; // promień Ziemi w metrach

  const lat1Rad = (startLat * Math.PI) / 180;
  const lat2Rad = (endLat * Math.PI) / 180;
  const deltaLat = ((endLat - startLat) * Math.PI) / 180;
  const deltaLng = ((endLng - startLng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c; // odległość w metrach
}
