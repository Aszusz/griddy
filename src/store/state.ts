import { GRID_SIZE } from '../constants'

export type Tool = 'select' | 'rectangle' | 'ellipse' | 'line' | 'pan'

export type ShapeType = 'rectangle' | 'ellipse' | 'line'

export type RectShape = {
  id: string
  type: 'rectangle' | 'ellipse'
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
}

export type LineShape = {
  id: string
  type: 'line'
  x: number
  y: number
  x2: number
  y2: number
  stroke: string
}

export type Shape = RectShape | LineShape

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

export type LineEndpointDragState = {
  endpoint: 'start' | 'end'
  startX: number
  startY: number
  originalLine: { x: number; y: number; x2: number; y2: number }
} | null

export type MoveState = {
  startX: number
  startY: number
  originalPositions: {
    id: string
    x: number
    y: number
    x2?: number
    y2?: number
  }[]
  originalShapes: Shape[] // Snapshot for undo
  originalSelectedIds: string[]
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

// Undoable state: shapes and selection only
export type UndoableState = {
  shapes: Shape[]
  selectedIds: string[]
}

export const MAX_HISTORY_SIZE = 50

export type AppState = {
  activeTool: Tool
  shapes: Shape[]
  drawing: DrawingState
  viewport: ViewportState
  selectedIds: string[]
  marquee: MarqueeState
  resize: ResizeState
  lineEndpointDrag: LineEndpointDragState
  move: MoveState
  clipboard: ClipboardState
  panX: number
  panY: number
  pan: PanState
  zoom: number
  spacebarHeld: boolean
  toolBeforeSpacebar: Tool | null
  past: UndoableState[]
  future: UndoableState[]
  mouseX: number | null
  mouseY: number | null
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
  lineEndpointDrag: null,
  move: null,
  clipboard: null,
  panX: 0,
  panY: 0,
  pan: null,
  zoom: 1,
  spacebarHeld: false,
  toolBeforeSpacebar: null,
  past: [],
  future: [],
  mouseX: null,
  mouseY: null,
}
