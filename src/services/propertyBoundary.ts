import type { Coordinates } from '../models/climora'

export const boundarySize = 4

export function outlinePoints(points: Coordinates[]) {
  const [topLeft, topRight, bottomLeft, bottomRight] = points
  return [topLeft, topRight, bottomRight, bottomLeft]
}

export function isValidBoundary(points?: Coordinates[]): boolean {
  if (points?.length !== boundarySize) return false

  const outline = outlinePoints(points)
  const turns = outline.map((point, index) => {
    const next = outline[(index + 1) % boundarySize]
    const after = outline[(index + 2) % boundarySize]
    return (
      (next.lng - point.lng) * (after.lat - next.lat) -
      (next.lat - point.lat) * (after.lng - next.lng)
    )
  })

  return turns.every((turn) => turn > 0) || turns.every((turn) => turn < 0)
}

export function boundaryAreaHectares(points?: Coordinates[]) {
  if (!points || !isValidBoundary(points)) return 0

  const outline = outlinePoints(points)
  const radians = Math.PI / 180
  const earthRadius = 6_371_008.8
  const referenceSin = Math.sin(outline[0].lat * radians)
  const areaFactor = outline.reduce((sum, point, index) => {
    const next = outline[(index + 1) % outline.length]
    const longitudeDelta = ((next.lng - point.lng + 540) % 360) - 180
    const projectedLatitude =
      Math.sin(point.lat * radians) +
      Math.sin(next.lat * radians) -
      2 * referenceSin
    return sum + longitudeDelta * radians * projectedLatitude
  }, 0)

  return (Math.abs(areaFactor) * earthRadius ** 2) / 20_000
}
