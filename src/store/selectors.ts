import type { RootState } from './index'

export const selectActiveTool = (state: RootState) => state.app.activeTool
export const selectShapes = (state: RootState) => state.app.shapes
export const selectDrawing = (state: RootState) => state.app.drawing
