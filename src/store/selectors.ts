import type { RootState } from './index'
import type { DrawingState, Tool } from './state'
import { snapToGrid } from '../utils'

export const selectActiveTool = (state: RootState) => state.app.activeTool
export const selectShapes = (state: RootState) => state.app.shapes
export const selectDrawing = (state: RootState) => state.app.drawing
export const selectSelectedIds = (state: RootState) => state.app.selectedIds
export const selectMarquee = (state: RootState) => state.app.marquee
export const selectSelectedShapes = (state: RootState) =>
  state.app.shapes.filter((s) => state.app.selectedIds.includes(s.id))
export const selectResize = (state: RootState) => state.app.resize
export const selectLineEndpointDrag = (state: RootState) =>
  state.app.lineEndpointDrag
export const selectMove = (state: RootState) => state.app.move
export const selectPan = (state: RootState) => state.app.pan
export const selectPanX = (state: RootState) => state.app.panX
export const selectPanY = (state: RootState) => state.app.panY
export const selectZoom = (state: RootState) => state.app.zoom
export const selectMouseX = (state: RootState) => state.app.mouseX
export const selectMouseY = (state: RootState) => state.app.mouseY
export const selectCanUndo = (state: RootState) => state.app.past.length > 0
export const selectCanRedo = (state: RootState) => state.app.future.length > 0

export const selectEditingTextId = (state: RootState) => state.app.editingTextId

function computePreviewRect(drawing: DrawingState, activeTool: Tool) {
  if (!drawing) return null
  if (activeTool === 'line' || activeTool === 'arrow' || activeTool === 'text')
    return null
  return {
    x: snapToGrid(Math.min(drawing.startX, drawing.currentX)),
    y: snapToGrid(Math.min(drawing.startY, drawing.currentY)),
    width:
      snapToGrid(Math.max(drawing.startX, drawing.currentX)) -
      snapToGrid(Math.min(drawing.startX, drawing.currentX)),
    height:
      snapToGrid(Math.max(drawing.startY, drawing.currentY)) -
      snapToGrid(Math.min(drawing.startY, drawing.currentY)),
    isEllipse: activeTool === 'ellipse',
  }
}

export const selectPreviewRect = (state: RootState) =>
  computePreviewRect(state.app.drawing, state.app.activeTool)

export const selectPreviewLine = (state: RootState) => {
  const drawing = state.app.drawing
  const tool = state.app.activeTool
  if (!drawing || (tool !== 'line' && tool !== 'arrow')) return null
  return {
    x: snapToGrid(drawing.startX),
    y: snapToGrid(drawing.startY),
    x2: snapToGrid(drawing.currentX),
    y2: snapToGrid(drawing.currentY),
  }
}

export const selectPreviewText = (state: RootState) => {
  const drawing = state.app.drawing
  const tool = state.app.activeTool
  if (!drawing || tool !== 'text') return null
  return {
    x: snapToGrid(Math.min(drawing.startX, drawing.currentX)),
    y: snapToGrid(Math.min(drawing.startY, drawing.currentY)),
    width:
      snapToGrid(Math.max(drawing.startX, drawing.currentX)) -
      snapToGrid(Math.min(drawing.startX, drawing.currentX)),
    height:
      snapToGrid(Math.max(drawing.startY, drawing.currentY)) -
      snapToGrid(Math.min(drawing.startY, drawing.currentY)),
  }
}
