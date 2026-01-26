import type { Rectangle, MarqueeState } from '../store/state'
import {
  GRID_SIZE,
  GRID_DOT_COLOR,
  GRID_DOT_RADIUS,
  SHAPE_STROKE_WIDTH,
  PREVIEW_FILL,
  PREVIEW_STROKE,
  SELECTION_BORDER_COLOR,
  SELECTION_BORDER_WIDTH,
  SELECTION_BORDER_OFFSET,
  SELECTION_HANDLE_STROKE_WIDTH,
  MARQUEE_FILL,
  MARQUEE_DASH_PATTERN,
  CROSSHAIR_COLOR,
  CROSSHAIR_SIZE,
  CROSSHAIR_CENTER_RADIUS,
} from '../constants'

type Rect = { x: number; y: number; width: number; height: number }

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  ctx.fillStyle = GRID_DOT_COLOR
  const startX = -originX - (((-originX % GRID_SIZE) + GRID_SIZE) % GRID_SIZE)
  const startY = -originY - (((-originY % GRID_SIZE) + GRID_SIZE) % GRID_SIZE)
  for (let x = startX; x < canvasWidth - originX; x += GRID_SIZE) {
    for (let y = startY; y < canvasHeight - originY; y += GRID_SIZE) {
      ctx.beginPath()
      ctx.arc(x, y, GRID_DOT_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

export function drawShapes(
  ctx: CanvasRenderingContext2D,
  shapes: Rectangle[]
): void {
  shapes.forEach((shape) => {
    ctx.fillStyle = shape.fill
    ctx.strokeStyle = shape.stroke
    ctx.lineWidth = SHAPE_STROKE_WIDTH
    ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
  })
}

export function drawSelectionBounds(
  ctx: CanvasRenderingContext2D,
  selectedShapes: Rectangle[]
): void {
  if (selectedShapes.length === 0) return
  const minX = Math.min(...selectedShapes.map((s) => s.x))
  const minY = Math.min(...selectedShapes.map((s) => s.y))
  const maxX = Math.max(...selectedShapes.map((s) => s.x + s.width))
  const maxY = Math.max(...selectedShapes.map((s) => s.y + s.height))

  ctx.strokeStyle = SELECTION_BORDER_COLOR
  ctx.lineWidth = SELECTION_BORDER_WIDTH
  ctx.strokeRect(
    minX - SELECTION_BORDER_OFFSET,
    minY - SELECTION_BORDER_OFFSET,
    maxX - minX + SELECTION_BORDER_WIDTH,
    maxY - minY + SELECTION_BORDER_WIDTH
  )
}

export function drawPreview(
  ctx: CanvasRenderingContext2D,
  previewRect: Rect | null
): void {
  if (!previewRect || previewRect.width <= 0 || previewRect.height <= 0) return
  ctx.fillStyle = PREVIEW_FILL
  ctx.strokeStyle = PREVIEW_STROKE
  ctx.lineWidth = SHAPE_STROKE_WIDTH
  ctx.fillRect(
    previewRect.x,
    previewRect.y,
    previewRect.width,
    previewRect.height
  )
  ctx.strokeRect(
    previewRect.x,
    previewRect.y,
    previewRect.width,
    previewRect.height
  )
}

export function drawMarquee(
  ctx: CanvasRenderingContext2D,
  marquee: MarqueeState
): void {
  if (!marquee) return
  const mx = Math.min(marquee.startX, marquee.currentX)
  const my = Math.min(marquee.startY, marquee.currentY)
  const mw = Math.abs(marquee.currentX - marquee.startX)
  const mh = Math.abs(marquee.currentY - marquee.startY)
  ctx.fillStyle = MARQUEE_FILL
  ctx.strokeStyle = SELECTION_BORDER_COLOR
  ctx.lineWidth = SELECTION_HANDLE_STROKE_WIDTH
  ctx.setLineDash([...MARQUEE_DASH_PATTERN])
  ctx.fillRect(mx, my, mw, mh)
  ctx.strokeRect(mx, my, mw, mh)
  ctx.setLineDash([])
}

export function drawCrosshair(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = CROSSHAIR_COLOR
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, -CROSSHAIR_SIZE)
  ctx.lineTo(0, CROSSHAIR_SIZE)
  ctx.moveTo(-CROSSHAIR_SIZE, 0)
  ctx.lineTo(CROSSHAIR_SIZE, 0)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(0, 0, CROSSHAIR_CENTER_RADIUS, 0, Math.PI * 2)
  ctx.stroke()
}
