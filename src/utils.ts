import { GRID_SIZE } from './constants'
import type { Shape, LineShape } from './store/state'

export function isLineShape(s: Shape): s is LineShape {
  return s.type === 'line'
}

export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

export function pointInRect(
  x: number,
  y: number,
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  )
}

export function pointNearLine(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tolerance: number
): boolean {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSq = dx * dx + dy * dy

  if (lengthSq === 0) {
    // Line is a point
    const d = Math.sqrt((px - x1) ** 2 + (py - y1) ** 2)
    return d <= tolerance
  }

  // Project point onto line, clamped to segment
  const t = Math.max(
    0,
    Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSq)
  )
  const closestX = x1 + t * dx
  const closestY = y1 + t * dy
  const distance = Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2)
  return distance <= tolerance
}
