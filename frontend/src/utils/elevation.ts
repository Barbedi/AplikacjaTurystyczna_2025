export function calculateElevationGainAndLoss(coords: number[][]): { gain: number; loss: number } {
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < coords.length; i++) {
    const delta = coords[i][2] - coords[i - 1][2];
    if (delta > 0) gain += delta;
    else if (delta < 0) loss += Math.abs(delta);
  }
  return { gain, loss };
}