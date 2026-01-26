import type { AppState, HandlePosition } from '../state'
import { snapToGrid, isLineShape } from '../../utils'
import { GRID_SIZE } from '../../constants'

function computeResizedShape(
  original: { x: number; y: number; width: number; height: number },
  handle: HandlePosition,
  dx: number,
  dy: number
): { x: number; y: number; width: number; height: number } {
  let { x, y, width, height } = original

  if (handle.includes('e')) {
    width = Math.max(GRID_SIZE, snapToGrid(original.width + dx))
  }
  if (handle.includes('w')) {
    const newWidth = Math.max(GRID_SIZE, snapToGrid(original.width - dx))
    x = original.x + original.width - newWidth
    width = newWidth
  }
  if (handle.includes('s')) {
    height = Math.max(GRID_SIZE, snapToGrid(original.height + dy))
  }
  if (handle.includes('n')) {
    const newHeight = Math.max(GRID_SIZE, snapToGrid(original.height - dy))
    y = original.y + original.height - newHeight
    height = newHeight
  }

  return { x, y, width, height }
}

export function handleResizeStarted(
  state: AppState,
  handle: HandlePosition,
  x: number,
  y: number
): AppState {
  if (state.selectedIds.length !== 1) return state
  const shape = state.shapes.find((s) => s.id === state.selectedIds[0])
  if (!shape || isLineShape(shape)) return state
  return {
    ...state,
    resize: {
      handle,
      startX: x,
      startY: y,
      originalShape: {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
      },
    },
  }
}

export function handleResizeMoved(
  state: AppState,
  x: number,
  y: number
): AppState {
  if (!state.resize || state.selectedIds.length !== 1) return state
  const dx = x - state.resize.startX
  const dy = y - state.resize.startY
  const newBounds = computeResizedShape(
    state.resize.originalShape,
    state.resize.handle,
    dx,
    dy
  )
  return {
    ...state,
    shapes: state.shapes.map((s) =>
      s.id === state.selectedIds[0] ? { ...s, ...newBounds } : s
    ),
  }
}

export function handleLineEndpointStarted(
  state: AppState,
  endpoint: 'start' | 'end',
  x: number,
  y: number
): AppState {
  if (state.selectedIds.length !== 1) return state
  const shape = state.shapes.find((s) => s.id === state.selectedIds[0])
  if (!shape || !isLineShape(shape)) return state
  return {
    ...state,
    lineEndpointDrag: {
      endpoint,
      startX: x,
      startY: y,
      originalLine: { x: shape.x, y: shape.y, x2: shape.x2, y2: shape.y2 },
    },
  }
}

export function handleLineEndpointMoved(
  state: AppState,
  x: number,
  y: number
): AppState {
  if (!state.lineEndpointDrag || state.selectedIds.length !== 1) return state
  const dx = x - state.lineEndpointDrag.startX
  const dy = y - state.lineEndpointDrag.startY
  const { endpoint, originalLine } = state.lineEndpointDrag
  return {
    ...state,
    shapes: state.shapes.map((s) => {
      if (s.id !== state.selectedIds[0] || !isLineShape(s)) return s
      if (endpoint === 'start') {
        return {
          ...s,
          x: snapToGrid(originalLine.x + dx),
          y: snapToGrid(originalLine.y + dy),
        }
      }
      return {
        ...s,
        x2: snapToGrid(originalLine.x2 + dx),
        y2: snapToGrid(originalLine.y2 + dy),
      }
    }),
  }
}
