import { GRID_SIZE } from '../constants'

export type Tool = 'select' | 'rectangle' | 'ellipse' | 'pan'

export type ShapeType = 'rectangle' | 'ellipse'

export type Shape = {
  id: string
  type: ShapeType
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

export type PanState = {
  startX: number
  startY: number
  originalPanX: number
  originalPanY: number
} | null

export type ClipboardState = {
  shapes: Shape[]
  pasteCount: number
} | null

export type AppState = {
  activeTool: Tool
  shapes: Shape[]
  drawing: DrawingState
  viewport: ViewportState
  selectedIds: string[]
  marquee: MarqueeState
  resize: ResizeState
  move: MoveState
  clipboard: ClipboardState
  panX: number
  panY: number
  pan: PanState
  spacebarHeld: boolean
  toolBeforeSpacebar: Tool | null
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
    gridSize: GRID_SIZE,
  },
  selectedIds: [],
  marquee: null,
  resize: null,
  move: null,
  clipboard: null,
  panX: 0,
  panY: 0,
  pan: null,
  spacebarHeld: false,
  toolBeforeSpacebar: null,
}
