export const TWO_PI = Math.PI * 2

export const GRID_SIZE = 20

export const SHAPE_FILL = '#3b82f6'
export const SHAPE_STROKE = '#60a5fa'
export const TEXT_FILL = '#ffffff'
export const PREVIEW_FILL = '#3b82f680'
export const PREVIEW_STROKE = '#60a5fa80'

export const GRID_DOT_RADIUS = 1
export const CROSSHAIR_COLOR = 'rgba(34, 211, 238, 0.25)'
export const CROSSHAIR_SIZE = 17
export const CROSSHAIR_CENTER_RADIUS = 3

export const SHAPE_STROKE_WIDTH = 2

export const SELECTION_BORDER_WIDTH = 2
export const SELECTION_BORDER_OFFSET = 1
export const SELECTION_HANDLE_SIZE = 8
export const SELECTION_HANDLE_FILL = '#fff'
export const SELECTION_HANDLE_STROKE_WIDTH = 1
export const MARQUEE_DASH_PATTERN = [4, 4] as const

export const PASTE_OFFSET = GRID_SIZE

export const LINE_HIT_TOLERANCE = 5

export const ARROWHEAD_SIZE = 12
export const ARROWHEAD_ANGLE = Math.PI / 6 // 30 degrees

export const MIN_ZOOM = 0.25
export const MAX_ZOOM = 8
export const ZOOM_STEP = 1.1
export const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.5, 2, 4, 8] as const

export const FONT_MAP = {
  serif: 'Georgia, serif',
  sans: 'system-ui, sans-serif',
  mono: 'ui-monospace, monospace',
} as const

export const TEXT_FONT_SIZE = 16
export const TEXT_LINE_HEIGHT = 20
export const TEXT_PADDING = 4
export const TEXT_PREVIEW_FILL = 'rgba(255, 255, 255, 0.1)'
export const TEXT_DASH_PATTERN = [4, 4] as const

export const EXPORT_PNG_PADDING = 20
export const EXPORT_PNG_BG = '#ffffff'

export const LOCALSTORAGE_KEY = 'griddy-canvas'
export const THEME_LOCALSTORAGE_KEY = 'griddy-theme'

// Color palettes for inspector
export const FILL_PALETTE = [
  { name: 'red', hex: '#fecaca' },
  { name: 'rose', hex: '#fecdd3' },
  { name: 'orange', hex: '#fed7aa' },
  { name: 'amber', hex: '#fde68a' },
  { name: 'yellow', hex: '#fef08a' },
  { name: 'lime', hex: '#d9f99d' },
  { name: 'green', hex: '#bbf7d0' },
  { name: 'emerald', hex: '#a7f3d0' },
  { name: 'teal', hex: '#99f6e4' },
  { name: 'cyan', hex: '#a5f3fc' },
  { name: 'sky', hex: '#bae6fd' },
  { name: 'blue', hex: '#bfdbfe' },
  { name: 'indigo', hex: '#c7d2fe' },
  { name: 'violet', hex: '#ddd6fe' },
  { name: 'purple', hex: '#e9d5ff' },
  { name: 'pink', hex: '#fbcfe8' },
  { name: 'white', hex: '#ffffff' },
  { name: 'slate', hex: '#e2e8f0' },
  { name: 'gray', hex: '#d1d5db' },
  { name: 'zinc', hex: '#a1a1aa' },
] as const

export const STROKE_PALETTE = [
  { name: 'red', hex: '#b91c1c' },
  { name: 'rose', hex: '#be123c' },
  { name: 'orange', hex: '#c2410c' },
  { name: 'amber', hex: '#b45309' },
  { name: 'yellow', hex: '#a16207' },
  { name: 'lime', hex: '#4d7c0f' },
  { name: 'green', hex: '#15803d' },
  { name: 'emerald', hex: '#047857' },
  { name: 'teal', hex: '#0f766e' },
  { name: 'cyan', hex: '#0e7490' },
  { name: 'sky', hex: '#0369a1' },
  { name: 'blue', hex: '#1d4ed8' },
  { name: 'indigo', hex: '#4338ca' },
  { name: 'violet', hex: '#6d28d9' },
  { name: 'purple', hex: '#7e22ce' },
  { name: 'pink', hex: '#be185d' },
  { name: 'black', hex: '#000000' },
  { name: 'slate', hex: '#334155' },
  { name: 'gray', hex: '#4b5563' },
  { name: 'zinc', hex: '#52525b' },
] as const

import type { HandlePosition } from './store/state'

type ShapeBounds = { x: number; y: number; width: number; height: number }

export const HANDLE_POSITIONS: {
  position: HandlePosition
  cursor: string
  getOffset: (shape: ShapeBounds) => { x: number; y: number }
}[] = [
  {
    position: 'nw',
    cursor: 'nwse-resize',
    getOffset: (s) => ({ x: s.x, y: s.y }),
  },
  {
    position: 'n',
    cursor: 'ns-resize',
    getOffset: (s) => ({ x: s.x + s.width / 2, y: s.y }),
  },
  {
    position: 'ne',
    cursor: 'nesw-resize',
    getOffset: (s) => ({ x: s.x + s.width, y: s.y }),
  },
  {
    position: 'e',
    cursor: 'ew-resize',
    getOffset: (s) => ({ x: s.x + s.width, y: s.y + s.height / 2 }),
  },
  {
    position: 'se',
    cursor: 'nwse-resize',
    getOffset: (s) => ({ x: s.x + s.width, y: s.y + s.height }),
  },
  {
    position: 's',
    cursor: 'ns-resize',
    getOffset: (s) => ({ x: s.x + s.width / 2, y: s.y + s.height }),
  },
  {
    position: 'sw',
    cursor: 'nesw-resize',
    getOffset: (s) => ({ x: s.x, y: s.y + s.height }),
  },
  {
    position: 'w',
    cursor: 'ew-resize',
    getOffset: (s) => ({ x: s.x, y: s.y + s.height / 2 }),
  },
]
