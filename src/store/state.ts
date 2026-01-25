export type Tool = 'select' | 'rectangle'

export type Rectangle = {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export type DrawingState = {
  startX: number
  startY: number
  currentX: number
  currentY: number
} | null

export type AppState = {
  activeTool: Tool
  shapes: Rectangle[]
  drawing: DrawingState
}

export const initialState: AppState = {
  activeTool: 'select',
  shapes: [],
  drawing: null,
}
