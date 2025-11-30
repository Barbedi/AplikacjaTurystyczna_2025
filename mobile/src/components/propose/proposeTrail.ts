export const getAllowedTrailLevels = (
  experience: number,
  fitness: number,
): [number, number] => {
  if (experience === 1 && fitness <= 2) {
    return [1, 2];
  }
  if (experience <= 2 && fitness <= 3) {
    return [1, 3];
  }
  if (experience >= 3 && fitness >= 3 && fitness <= 4) {
    return [1, 4];
  }
  if (experience >= 4 && fitness >= 4) {
    return [1, 5];
  }
  if (experience === 5 && fitness === 5) {
    return [1, 5];
  }
  return [1, 3];
};

export const mapDifficultyToNumber = (difficulty: string): number => {
  const cleanDifficulty = difficulty.toLowerCase().trim();
  switch (cleanDifficulty) {
    case "bardzo łatwe":
    case "bardzo łatwa":
      return 1;
    case "łatwe":
    case "łatwa":
      return 2;
    case "średnie":
    case "średnia":
      return 3;
    case "trudne":
    case "trudna":
      return 4;
    case "bardzo trudne":
    case "bardzo trudna":
      return 5;
    default:
      console.warn(`Nieznany poziom trudności: "${difficulty}"`);
      return 3;
  }
};

export const difficultyLabels: Record<number, string> = {
  1: "Bardzo łatwy",
  2: "Łatwy",
  3: "Średni",
  4: "Trudny",
  5: "Bardzo trudny",
};

export const fitnessMap: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
  pro: 5,
};

export const experienceMap: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
  pro: 5,
};
