export function calculateElevationGainAndLoss(coords: number[][]): {
  gain: string;
  loss: string;
} {
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < coords.length; i++) {
    const delta = coords[i][2] - coords[i - 1][2];
    if (delta > 0) gain += delta;
    else if (delta < 0) loss += Math.abs(delta);
  }
  return {
    gain: gain.toFixed(0),
    loss: loss.toFixed(0),
  };
}
