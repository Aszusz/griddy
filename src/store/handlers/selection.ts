import type {
  AppState,
  Tool,
  RectShape,
  LineShape,
  MarqueeState,
} from '../state'
import { pointHitsShape, isLineShape } from '../../utils'

function rectContainsRect(
  outer: { x: number; y: number; width: number; height: number },
  inner: RectShape
): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  )
}

function rectContainsLine(
  rect: { x: number; y: number; width: number; height: number },
  line: LineShape
): boolean {
  const inRect = (px: number, py: number) =>
    px >= rect.x &&
    px <= rect.x + rect.width &&
    py >= rect.y &&
    py <= rect.y + rect.height
  return inRect(line.x, line.y) && inRect(line.x2, line.y2)
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
  const clickedShape = state.shapes.find((s) => pointHitsShape(x, y, s))
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

export function handleSelectionClear(state: AppState): AppState {
  if (state.selectedIds.length === 0) return state
  return { ...state, selectedIds: [] }
}

export function handleMarqueeMoved(
  state: AppState,
  x: number,
  y: number
): AppState {
  if (!state.marquee) return state
  return { ...state, marquee: { ...state.marquee, currentX: x, currentY: y } }
}

export function handleMarqueeEnded(
  state: AppState,
  shiftKey: boolean
): AppState {
  if (!state.marquee) return state
  const bounds = getMarqueeBounds(state.marquee)
  const containedIds = state.shapes
    .filter((s) => {
      if (isLineShape(s)) {
        return rectContainsLine(bounds, s)
      }
      return rectContainsRect(bounds, s as RectShape)
    })
    .map((s) => s.id)
  const newSelectedIds = shiftKey
    ? [
        ...state.selectedIds,
        ...containedIds.filter((id) => !state.selectedIds.includes(id)),
      ]
    : containedIds
  return { ...state, selectedIds: newSelectedIds, marquee: null }
}
