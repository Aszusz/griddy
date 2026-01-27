import type { AppState, RectShape, LineShape, TextShape } from '../state'
import { snapToGrid } from '../../utils'
import { SHAPE_FILL, SHAPE_STROKE, TEXT_FILL } from '../../constants'

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
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 }
}

export function handleDrawingMoved(
  state: AppState,
  x: number,
  y: number
): AppState {
  if (!state.drawing) return state
  return { ...state, drawing: { ...state.drawing, currentX: x, currentY: y } }
}

export function handleDrawingEnded(state: AppState): AppState {
  if (!state.drawing) return state

  if (state.activeTool === 'line' || state.activeTool === 'arrow') {
    const x = snapToGrid(state.drawing.startX)
    const y = snapToGrid(state.drawing.startY)
    const x2 = snapToGrid(state.drawing.currentX)
    const y2 = snapToGrid(state.drawing.currentY)
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
      arrowEnd: state.activeTool === 'arrow' ? true : undefined,
    }
    return { ...state, shapes: [...state.shapes, newLine], drawing: null }
  }

  if (state.activeTool === 'text') {
    const rect = createRectFromDrawing(
      state.drawing.startX,
      state.drawing.startY,
      state.drawing.currentX,
      state.drawing.currentY
    )
    if (rect.width === 0 || rect.height === 0) {
      return { ...state, drawing: null }
    }
    const newText: TextShape = {
      ...rect,
      id: crypto.randomUUID(),
      type: 'text',
      text: '',
      fill: TEXT_FILL,
      fontFamily: 'sans',
      align: 'left',
    }
    return {
      ...state,
      shapes: [...state.shapes, newText],
      drawing: null,
      editingTextId: newText.id,
      selectedIds: [newText.id],
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
  const shapeType = state.activeTool === 'ellipse' ? 'ellipse' : 'rectangle'
  const newShape: RectShape = {
    ...rect,
    id: crypto.randomUUID(),
    type: shapeType,
    fill: SHAPE_FILL,
    stroke: SHAPE_STROKE,
  }
  return { ...state, shapes: [...state.shapes, newShape], drawing: null }
}
