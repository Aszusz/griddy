import type {
  AppState,
  Tool,
  RectShape,
  LineShape,
  MarqueeState,
} from '../state'
import { pointInRect, pointNearLine, isLineShape } from '../../utils'
import { LINE_HIT_TOLERANCE } from '../../constants'

function rectsIntersect(
  a: { x: number; y: number; width: number; height: number },
  b: RectShape
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

function lineIntersectsRect(
  line: LineShape,
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  const inRect = (px: number, py: number) =>
    px >= rect.x &&
    px <= rect.x + rect.width &&
    py >= rect.y &&
    py <= rect.y + rect.height
  if (inRect(line.x, line.y) || inRect(line.x2, line.y2)) return true
  const lx1 = Math.min(line.x, line.x2)
  const ly1 = Math.min(line.y, line.y2)
  const lx2 = Math.max(line.x, line.x2)
  const ly2 = Math.max(line.y, line.y2)
  return !(
    lx2 < rect.x ||
    lx1 > rect.x + rect.width ||
    ly2 < rect.y ||
    ly1 > rect.y + rect.height
  )
}

function getMarqueeBounds(marquee: NonNullable<MarqueeState>) {
  return {
    x: Math.min(marquee.startX, marquee.currentX),
    y: Math.min(marquee.startY, marquee.currentY),
    width: Math.abs(marquee.currentX - marquee.startX),
    height: Math.abs(marquee.currentY - marquee.startY),
  }
}

export function handleToolSelected(state: AppState, tool: Tool): AppState {
  return { ...state, activeTool: tool, selectedIds: [] }
}

export function handleSelectionClicked(
  state: AppState,
  x: number,
  y: number,
  shiftKey: boolean
): AppState {
  const clickedShape = state.shapes.find((s) => {
    if (isLineShape(s)) {
      return pointNearLine(x, y, s.x, s.y, s.x2, s.y2, LINE_HIT_TOLERANCE)
    }
    return pointInRect(x, y, s)
  })
  if (!clickedShape) {
    return { ...state, selectedIds: [] }
  }
  if (shiftKey) {
    const isSelected = state.selectedIds.includes(clickedShape.id)
    if (isSelected) {
      return {
        ...state,
        selectedIds: state.selectedIds.filter((id) => id !== clickedShape.id),
      }
    }
    return { ...state, selectedIds: [...state.selectedIds, clickedShape.id] }
  }
  return { ...state, selectedIds: [clickedShape.id] }
}

export function handleSelectionDelete(state: AppState): AppState {
  if (state.activeTool !== 'select' || state.selectedIds.length === 0) {
    return state
  }
  return {
    ...state,
    shapes: state.shapes.filter((s) => !state.selectedIds.includes(s.id)),
    selectedIds: [],
  }
}

export function handleMarqueeMoved(
  state: AppState,
  x: number,
  y: number
): AppState {
  if (!state.marquee) return state
  return { ...state, marquee: { ...state.marquee, currentX: x, currentY: y } }
}

export function handleMarqueeEnded(state: AppState): AppState {
  if (!state.marquee) return state
  const bounds = getMarqueeBounds(state.marquee)
  const intersectingIds = state.shapes
    .filter((s) => {
      if (isLineShape(s)) {
        return lineIntersectsRect(s, bounds)
      }
      return rectsIntersect(bounds, s as RectShape)
    })
    .map((s) => s.id)
  return { ...state, selectedIds: intersectingIds, marquee: null }
}
