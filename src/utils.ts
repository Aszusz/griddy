import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { GRID_SIZE, LINE_HIT_TOLERANCE } from './constants'
import type { Shape, LineShape, TextShape } from './store/state'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isLineShape(s: Shape): s is LineShape {
  return s.type === 'line'
}

export function isTextShape(s: Shape): s is TextShape {
  return s.type === 'text'
}

export function pointHitsShape(x: number, y: number, s: Shape): boolean {
  if (isLineShape(s)) {
    return pointNearLine(x, y, s.x, s.y, s.x2, s.y2, LINE_HIT_TOLERANCE)
  }
  if (isTextShape(s)) {
    return pointInRect(x, y, s)
  }
  if (s.type === 'ellipse') {
    return pointInEllipse(x, y, s)
  }
  return pointInRect(x, y, s)
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

export function pointInEllipse(
  px: number,
  py: number,
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  const cx = rect.x + rect.width / 2
  const cy = rect.y + rect.height / 2
  const rx = rect.width / 2
  const ry = rect.height / 2
  if (rx === 0 || ry === 0) return false
  const dx = px - cx
  const dy = py - cy
  return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1
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
