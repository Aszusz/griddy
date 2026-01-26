import { match } from 'disc-union'
import type {
  AppState,
  Shape,
  RectShape,
  LineShape,
  MarqueeState,
  HandlePosition,
} from './state'
import { initialState } from './state'
import type { AppAction } from './actions'
import { snapToGrid, pointInRect, pointNearLine, isLineShape } from '../utils'
import {
  GRID_SIZE,
  SHAPE_FILL,
  SHAPE_STROKE,
  PASTE_OFFSET,
  LINE_HIT_TOLERANCE,
} from '../constants'

function computeResizedShape(
  original: { x: number; y: number; width: number; height: number },
  handle: HandlePosition,
  dx: number,
  dy: number
): { x: number; y: number; width: number; height: number } {
  let { x, y, width, height } = original

  // Apply deltas based on handle position
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

function createRectFromDrawing(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): { x: number; y: number; width: number; height: number } {
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
  // Check if either endpoint is inside the rect
  const inRect = (px: number, py: number) =>
    px >= rect.x &&
    px <= rect.x + rect.width &&
    py >= rect.y &&
    py <= rect.y + rect.height
  if (inRect(line.x, line.y) || inRect(line.x2, line.y2)) return true
  // Rough check: line bbox intersects rect
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

        if (state.activeTool === 'line') {
          const x = snapToGrid(state.drawing.startX)
          const y = snapToGrid(state.drawing.startY)
          const x2 = snapToGrid(state.drawing.currentX)
          const y2 = snapToGrid(state.drawing.currentY)
          // Discard zero-length lines
          if (x === x2 && y === y2) {
            return { ...state, drawing: null }
          }
          const newLine: LineShape = {
            id: crypto.randomUUID(),
            type: 'line',
            x,
            y,
            x2,
            y2,
            stroke: SHAPE_STROKE,
          }
          return {
            ...state,
            shapes: [...state.shapes, newLine],
            drawing: null,
          }
        }

        const rect = createRectFromDrawing(
          state.drawing.startX,
          state.drawing.startY,
          state.drawing.currentX,
          state.drawing.currentY
        )
        if (rect.width === 0 || rect.height === 0) {
          return { ...state, drawing: null }
        }
        const shapeType =
          state.activeTool === 'ellipse' ? 'ellipse' : 'rectangle'
        const newShape: RectShape = {
          ...rect,
          id: crypto.randomUUID(),
          type: shapeType,
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
          .filter((s) => {
            if (isLineShape(s)) {
              return lineIntersectsRect(s, bounds)
            }
            return rectsIntersect(bounds, s)
          })
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
      'resize/started': ({ handle, x, y }) => {
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
      },
      'resize/moved': ({ x, y }) => {
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
      },
      'resize/ended': () => ({
        ...state,
        resize: null,
      }),
      'lineEndpoint/started': ({ endpoint, x, y }) => {
        if (state.selectedIds.length !== 1) return state
        const shape = state.shapes.find((s) => s.id === state.selectedIds[0])
        if (!shape || !isLineShape(shape)) return state
        return {
          ...state,
          lineEndpointDrag: {
            endpoint,
            startX: x,
            startY: y,
            originalLine: {
              x: shape.x,
              y: shape.y,
              x2: shape.x2,
              y2: shape.y2,
            },
          },
        }
      },
      'lineEndpoint/moved': ({ x, y }) => {
        if (!state.lineEndpointDrag || state.selectedIds.length !== 1)
          return state
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
            } else {
              return {
                ...s,
                x2: snapToGrid(originalLine.x2 + dx),
                y2: snapToGrid(originalLine.y2 + dy),
              }
            }
          }),
        }
      },
      'lineEndpoint/ended': () => ({
        ...state,
        lineEndpointDrag: null,
      }),
      'move/started': ({ x, y }) => {
        if (state.selectedIds.length === 0) return state
        const originalPositions = state.shapes
          .filter((s) => state.selectedIds.includes(s.id))
          .map((s) => {
            if (isLineShape(s)) {
              return { id: s.id, x: s.x, y: s.y, x2: s.x2, y2: s.y2 }
            }
            return { id: s.id, x: s.x, y: s.y }
          })
        return {
          ...state,
          move: { startX: x, startY: y, originalPositions },
        }
      },
      'move/moved': ({ x, y }) => {
        if (!state.move) return state
        const dx = x - state.move.startX
        const dy = y - state.move.startY
        return {
          ...state,
          shapes: state.shapes.map((s) => {
            const original = state.move!.originalPositions.find(
              (p) => p.id === s.id
            )
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
      },
      'move/ended': () => ({
        ...state,
        move: null,
      }),
      'clipboard/copy': () => {
        if (state.activeTool !== 'select' || state.selectedIds.length === 0) {
          return state
        }
        const selectedShapes = state.shapes.filter((s) =>
          state.selectedIds.includes(s.id)
        )
        return {
          ...state,
          clipboard: { shapes: selectedShapes, pasteCount: 0 },
        }
      },
      'clipboard/cut': () => {
        if (state.activeTool !== 'select' || state.selectedIds.length === 0) {
          return state
        }
        const selectedShapes = state.shapes.filter((s) =>
          state.selectedIds.includes(s.id)
        )
        return {
          ...state,
          shapes: state.shapes.filter((s) => !state.selectedIds.includes(s.id)),
          selectedIds: [],
          clipboard: { shapes: selectedShapes, pasteCount: 0 },
        }
      },
      'clipboard/paste': () => {
        if (state.activeTool !== 'select' || !state.clipboard) {
          return state
        }
        const offset = (state.clipboard.pasteCount + 1) * PASTE_OFFSET
        const newShapes: Shape[] = state.clipboard.shapes.map((s) => {
          if (isLineShape(s)) {
            return {
              ...s,
              id: crypto.randomUUID(),
              x: s.x + offset,
              y: s.y + offset,
              x2: s.x2 + offset,
              y2: s.y2 + offset,
            }
          }
          return {
            ...s,
            id: crypto.randomUUID(),
            x: s.x + offset,
            y: s.y + offset,
          }
        })
        return {
          ...state,
          shapes: [...state.shapes, ...newShapes],
          selectedIds: newShapes.map((s) => s.id),
          clipboard: {
            ...state.clipboard,
            pasteCount: state.clipboard.pasteCount + 1,
          },
        }
      },
      'selection/delete': () => {
        if (state.activeTool !== 'select' || state.selectedIds.length === 0) {
          return state
        }
        return {
          ...state,
          shapes: state.shapes.filter((s) => !state.selectedIds.includes(s.id)),
          selectedIds: [],
        }
      },
      'pan/started': ({ x, y }) => ({
        ...state,
        pan: {
          startX: x,
          startY: y,
          originalPanX: state.panX,
          originalPanY: state.panY,
        },
      }),
      'pan/moved': ({ x, y }) => {
        if (!state.pan) return state
        const dx = x - state.pan.startX
        const dy = y - state.pan.startY
        return {
          ...state,
          panX: state.pan.originalPanX + dx,
          panY: state.pan.originalPanY + dy,
        }
      },
      'pan/ended': () => ({
        ...state,
        pan: null,
      }),
      'pan/reset': () => ({
        ...state,
        panX: 0,
        panY: 0,
      }),
      'spacebar/pressed': () => {
        if (state.spacebarHeld) return state
        return {
          ...state,
          spacebarHeld: true,
          toolBeforeSpacebar: state.activeTool,
          activeTool: 'pan' as const,
        }
      },
      'spacebar/released': () => {
        if (!state.spacebarHeld) return state
        return {
          ...state,
          spacebarHeld: false,
          activeTool: state.toolBeforeSpacebar ?? 'select',
          toolBeforeSpacebar: null,
        }
      },
    },
    () => state
  )
}
