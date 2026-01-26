import { match } from 'disc-union'
import type { AppState, Rectangle } from './state'
import { initialState } from './state'
import type { AppAction } from './actions'
import { snapToGrid } from '../utils'
import { GRID_SIZE } from '../constants'

function createRectFromDrawing(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Omit<Rectangle, 'id'> {
  const x1 = snapToGrid(Math.min(startX, endX))
  const y1 = snapToGrid(Math.min(startY, endY))
  const x2 = snapToGrid(Math.max(startX, endX))
  const y2 = snapToGrid(Math.max(startY, endY))
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  }
}

export function reducer(
  state: AppState = initialState,
  action: AppAction
): AppState {
  return match(
    action,
    {
      'app/started': () => state,
      'tool/selected': ({ tool }) => ({ ...state, activeTool: tool }),
      'drawing/started': ({ x, y }) => ({
        ...state,
        drawing: { startX: x, startY: y, currentX: x, currentY: y },
      }),
      'drawing/moved': ({ x, y }) =>
        state.drawing
          ? {
              ...state,
              drawing: { ...state.drawing, currentX: x, currentY: y },
            }
          : state,
      'drawing/ended': () => {
        if (!state.drawing) return state
        const rect = createRectFromDrawing(
          state.drawing.startX,
          state.drawing.startY,
          state.drawing.currentX,
          state.drawing.currentY
        )
        if (rect.width === 0 || rect.height === 0) {
          return { ...state, drawing: null }
        }
        const newShape: Rectangle = {
          ...rect,
          id: crypto.randomUUID(),
        }
        return {
          ...state,
          shapes: [...state.shapes, newShape],
          drawing: null,
        }
      },
      'viewport/resized': ({ width, height }) => ({
        ...state,
        viewport: {
          width,
          height,
          originX: width / 2,
          originY: height / 2,
          gridSize: GRID_SIZE,
        },
      }),
    },
    () => state
  )
}
