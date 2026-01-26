import type { AppState } from '../state'
import { snapToGrid, isLineShape } from '../../utils'

export function handleMoveStarted(
  state: AppState,
  x: number,
  y: number
): AppState {
  if (state.selectedIds.length === 0) return state
  const originalPositions = state.shapes
    .filter((s) => state.selectedIds.includes(s.id))
    .map((s) => {
      if (isLineShape(s)) {
        return { id: s.id, x: s.x, y: s.y, x2: s.x2, y2: s.y2 }
      }
      return { id: s.id, x: s.x, y: s.y }
    })
  return { ...state, move: { startX: x, startY: y, originalPositions } }
}

export function handleMoveMoved(
  state: AppState,
  x: number,
  y: number
): AppState {
  if (!state.move) return state
  const dx = x - state.move.startX
  const dy = y - state.move.startY
  return {
    ...state,
    shapes: state.shapes.map((s) => {
      const original = state.move!.originalPositions.find((p) => p.id === s.id)
      if (!original) return s
      if (
        isLineShape(s) &&
        original.x2 !== undefined &&
        original.y2 !== undefined
      ) {
        return {
          ...s,
          x: snapToGrid(original.x + dx),
          y: snapToGrid(original.y + dy),
          x2: snapToGrid(original.x2 + dx),
          y2: snapToGrid(original.y2 + dy),
        }
      }
      return {
        ...s,
        x: snapToGrid(original.x + dx),
        y: snapToGrid(original.y + dy),
      }
    }),
  }
}
