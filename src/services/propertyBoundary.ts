import type { Coordinates } from "../models/climora";

export const boundarySize = 4;

export function outlinePoints(points: Coordinates[]) {
  const [topLeft, topRight, bottomLeft, bottomRight] = points;
  return [topLeft, topRight, bottomRight, bottomLeft];
}

export function isValidBoundary(points?: Coordinates[]): boolean {
  if (points?.length !== boundarySize) return false;

  const outline = outlinePoints(points);
  const turns = outline.map((point, index) => {
    const next = outline[(index + 1) % boundarySize];
    const after = outline[(index + 2) % boundarySize];
    return (
      (next.lng - point.lng) * (after.lat - next.lat) -
      (next.lat - point.lat) * (after.lng - next.lng)
    );
  });

  return turns.every((turn) => turn > 0) || turns.every((turn) => turn < 0);
}
