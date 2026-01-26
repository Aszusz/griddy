export type Tool = 'select' | 'rectangle'

export type Rectangle = {
  id: string
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
}

export type DrawingState = {
  startX: number
  startY: number
  currentX: number
  currentY: number
} | null

export type ViewportState = {
  width: number
  height: number
  originX: number
  originY: number
  gridSize: number
}

export type MarqueeState = {
  startX: number
  startY: number
  currentX: number
  currentY: number
} | null

export type AppState = {
  activeTool: Tool
  shapes: Rectangle[]
  drawing: DrawingState
  viewport: ViewportState
  selectedIds: string[]
  marquee: MarqueeState
}

export const initialState: AppState = {
  activeTool: 'select',
  shapes: [],
  drawing: null,
  viewport: {
    width: 0,
    height: 0,
    originX: 0,
    originY: 0,
    gridSize: 20,
  },
  selectedIds: [],
  marquee: null,
}
