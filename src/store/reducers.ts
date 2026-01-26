import { match } from 'disc-union'
import type { AppState, Rectangle, MarqueeState } from './state'
import { initialState } from './state'
import type { AppAction } from './actions'
import { snapToGrid, pointInRect } from '../utils'
import { GRID_SIZE, SHAPE_FILL, SHAPE_STROKE } from '../constants'

function createRectFromDrawing(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Omit<Rectangle, 'id' | 'fill' | 'stroke'> {
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

function rectsIntersect(
  a: { x: number; y: number; width: number; height: number },
  b: Rectangle
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
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

export function reducer(
  state: AppState = initialState,
  action: AppAction
): AppState {
  return match(
    action,
    {
      'app/started': () => state,
      'tool/selected': ({ tool }) => ({
        ...state,
        activeTool: tool,
        selectedIds: [],
      }),
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
          fill: SHAPE_FILL,
          stroke: SHAPE_STROKE,
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
      'selection/clicked': ({ x, y, shiftKey }) => {
        const clickedShape = state.shapes.find((s) => pointInRect(x, y, s))
        if (!clickedShape) {
          return { ...state, selectedIds: [] }
        }
        if (shiftKey) {
          const isSelected = state.selectedIds.includes(clickedShape.id)
          if (isSelected) {
            return {
              ...state,
              selectedIds: state.selectedIds.filter(
                (id) => id !== clickedShape.id
              ),
            }
          } else {
            return {
              ...state,
              selectedIds: [...state.selectedIds, clickedShape.id],
            }
          }
        }
        return { ...state, selectedIds: [clickedShape.id] }
      },
      'marquee/started': ({ x, y }) => ({
        ...state,
        marquee: { startX: x, startY: y, currentX: x, currentY: y },
      }),
      'marquee/moved': ({ x, y }) =>
        state.marquee
          ? {
              ...state,
              marquee: { ...state.marquee, currentX: x, currentY: y },
            }
          : state,
      'marquee/ended': () => {
        if (!state.marquee) return state
        const bounds = getMarqueeBounds(state.marquee)
        const intersectingIds = state.shapes
          .filter((s) => rectsIntersect(bounds, s))
          .map((s) => s.id)
        return { ...state, selectedIds: intersectingIds, marquee: null }
      },
      'shape/positionChanged': ({ id, axis, rawValue }) => {
        const parsed = parseInt(rawValue, 10)
        if (isNaN(parsed)) return state
        return {
          ...state,
          shapes: state.shapes.map((s) =>
            s.id === id ? { ...s, [axis]: snapToGrid(parsed) } : s
          ),
        }
      },
      'shape/sizeChanged': ({ id, dim, rawValue }) => {
        const parsed = parseInt(rawValue, 10)
        if (isNaN(parsed)) return state
        return {
          ...state,
          shapes: state.shapes.map((s) =>
            s.id === id
              ? { ...s, [dim]: Math.max(GRID_SIZE, snapToGrid(parsed)) }
              : s
          ),
        }
      },
      'shape/colorChanged': ({ id, prop, color }) => ({
        ...state,
        shapes: state.shapes.map((s) =>
          s.id === id ? { ...s, [prop]: color } : s
        ),
      }),
    },
    () => state
  )
}
