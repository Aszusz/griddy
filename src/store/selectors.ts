import type { RootState } from './index'
import type { DrawingState } from './state'
import { snapToGrid } from '../utils'

export const selectActiveTool = (state: RootState) => state.app.activeTool
export const selectShapes = (state: RootState) => state.app.shapes
export const selectDrawing = (state: RootState) => state.app.drawing
export const selectSelectedIds = (state: RootState) => state.app.selectedIds
export const selectMarquee = (state: RootState) => state.app.marquee
export const selectSelectedShapes = (state: RootState) =>
  state.app.shapes.filter((s) => state.app.selectedIds.includes(s.id))
export const selectResize = (state: RootState) => state.app.resize
export const selectMove = (state: RootState) => state.app.move

function computePreviewRect(drawing: DrawingState) {
  if (!drawing) return null
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

export const selectPreviewRect = (state: RootState) =>
  computePreviewRect(state.app.drawing)
