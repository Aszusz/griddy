import type { RootState } from './index'

export const selectActiveTool = (state: RootState) => state.app.activeTool
export const selectShapes = (state: RootState) => state.app.shapes
export const selectDrawing = (state: RootState) => state.app.drawing
export const selectSelectedIds = (state: RootState) => state.app.selectedIds
export const selectMarquee = (state: RootState) => state.app.marquee
