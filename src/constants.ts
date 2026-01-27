export const TWO_PI = Math.PI * 2

export const GRID_SIZE = 20

export const CANVAS_BG = '#0a0a0b'

export const SHAPE_FILL = '#3b82f6'
export const SHAPE_STROKE = '#60a5fa'
export const PREVIEW_FILL = '#3b82f680'
export const PREVIEW_STROKE = '#60a5fa80'

export const GRID_DOT_COLOR = 'rgba(255, 255, 255, 0.25)'
export const GRID_DOT_RADIUS = 1
export const CROSSHAIR_COLOR = 'rgba(34, 211, 238, 0.25)'
export const CROSSHAIR_SIZE = 17
export const CROSSHAIR_CENTER_RADIUS = 3

export const SHAPE_STROKE_WIDTH = 2

export const SELECTION_BORDER_COLOR = '#22d3ee'
export const SELECTION_BORDER_WIDTH = 2
export const SELECTION_BORDER_OFFSET = 1
export const SELECTION_HANDLE_SIZE = 8
export const SELECTION_HANDLE_FILL = '#fff'
export const SELECTION_HANDLE_STROKE_WIDTH = 1
export const MARQUEE_FILL = 'rgba(34, 211, 238, 0.1)'
export const MARQUEE_DASH_PATTERN = [4, 4] as const

export const PASTE_OFFSET = GRID_SIZE

export const LINE_HIT_TOLERANCE = 5

export const ARROWHEAD_SIZE = 12
export const ARROWHEAD_ANGLE = Math.PI / 6 // 30 degrees

// Inspector ArrowheadControl colors (active reuses SELECTION_BORDER_COLOR)
export const ARROWHEAD_INACTIVE_COLOR = '#52525b'
export const ARROWHEAD_HITBOX_ACTIVE = 'rgba(34,211,238,0.15)'
export const ARROWHEAD_HITBOX_INACTIVE = 'rgba(63,63,70,0.3)'

export const MIN_ZOOM = 0.25
export const MAX_ZOOM = 8
export const ZOOM_STEP = 1.1
export const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.5, 2, 4, 8] as const

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
