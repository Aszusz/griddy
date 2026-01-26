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

export type HandlePosition = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export type ResizeState = {
  handle: HandlePosition
  startX: number
  startY: number
  originalShape: { x: number; y: number; width: number; height: number }
} | null

export type MoveState = {
  startX: number
  startY: number
  originalPositions: { id: string; x: number; y: number }[]
} | null

export type ClipboardState = {
  shapes: Rectangle[]
  pasteCount: number
} | null

export type AppState = {
  activeTool: Tool
  shapes: Rectangle[]
  drawing: DrawingState
  viewport: ViewportState
  selectedIds: string[]
  marquee: MarqueeState
  resize: ResizeState
  move: MoveState
  clipboard: ClipboardState
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
  resize: null,
  move: null,
  clipboard: null,
}
