import type { Shape, MarqueeState } from '../store/state'
import { isLineShape } from '../utils'
import {
  TWO_PI,
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
  ARROWHEAD_SIZE,
  ARROWHEAD_ANGLE,
} from '../constants'

type Rect = { x: number; y: number; width: number; height: number }
type PreviewRect = Rect & { isEllipse: boolean }
type PreviewLine = { x: number; y: number; x2: number; y2: number }

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  fromX: number,
  fromY: number
): void {
  const angle = Math.atan2(tipY - fromY, tipX - fromX)
  const leftAngle = angle + Math.PI - ARROWHEAD_ANGLE
  const rightAngle = angle + Math.PI + ARROWHEAD_ANGLE

  ctx.beginPath()
  ctx.moveTo(
    tipX + ARROWHEAD_SIZE * Math.cos(leftAngle),
    tipY + ARROWHEAD_SIZE * Math.sin(leftAngle)
  )
  ctx.lineTo(tipX, tipY)
  ctx.lineTo(
    tipX + ARROWHEAD_SIZE * Math.cos(rightAngle),
    tipY + ARROWHEAD_SIZE * Math.sin(rightAngle)
  )
  ctx.stroke()
}

function fillAndStrokeEllipse(ctx: CanvasRenderingContext2D, rect: Rect): void {
  const cx = rect.x + rect.width / 2
  const cy = rect.y + rect.height / 2
  ctx.beginPath()
  ctx.ellipse(cx, cy, rect.width / 2, rect.height / 2, 0, 0, TWO_PI)
  ctx.fill()
  ctx.stroke()
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  canvasWidth: number,
  canvasHeight: number,
  zoom = 1
): void {
  ctx.fillStyle = GRID_DOT_COLOR
  // Convert screen bounds to world coordinates
  const worldLeft = -originX / zoom
  const worldTop = -originY / zoom
  const worldRight = (canvasWidth - originX) / zoom
  const worldBottom = (canvasHeight - originY) / zoom

  // Snap to grid
  const startX = Math.floor(worldLeft / GRID_SIZE) * GRID_SIZE
  const startY = Math.floor(worldTop / GRID_SIZE) * GRID_SIZE

  for (let x = startX; x <= worldRight; x += GRID_SIZE) {
    for (let y = startY; y <= worldBottom; y += GRID_SIZE) {
      ctx.beginPath()
      ctx.arc(x, y, GRID_DOT_RADIUS / zoom, 0, TWO_PI)
      ctx.fill()
    }
  }
}

export function drawShapes(
  ctx: CanvasRenderingContext2D,
  shapes: Shape[]
): void {
  shapes.forEach((shape) => {
    ctx.strokeStyle = shape.stroke
    ctx.lineWidth = SHAPE_STROKE_WIDTH
    if (isLineShape(shape)) {
      ctx.beginPath()
      ctx.moveTo(shape.x, shape.y)
      ctx.lineTo(shape.x2, shape.y2)
      ctx.stroke()
      if (shape.arrowStart) {
        drawArrowhead(ctx, shape.x, shape.y, shape.x2, shape.y2)
      }
      if (shape.arrowEnd) {
        drawArrowhead(ctx, shape.x2, shape.y2, shape.x, shape.y)
      }
    } else {
      ctx.fillStyle = shape.fill
      if (shape.type === 'ellipse') {
        fillAndStrokeEllipse(ctx, shape)
      } else {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
      }
    }
  })
}

function getShapeBounds(s: Shape): {
  minX: number
  minY: number
  maxX: number
  maxY: number
} {
  if (isLineShape(s)) {
    return {
      minX: Math.min(s.x, s.x2),
      minY: Math.min(s.y, s.y2),
      maxX: Math.max(s.x, s.x2),
      maxY: Math.max(s.y, s.y2),
    }
  }
  return { minX: s.x, minY: s.y, maxX: s.x + s.width, maxY: s.y + s.height }
}

export function drawSelectionBounds(
  ctx: CanvasRenderingContext2D,
  selectedShapes: Shape[],
  zoom = 1
): void {
  if (selectedShapes.length === 0) return
  const bounds = selectedShapes.map(getShapeBounds)
  const minX = Math.min(...bounds.map((b) => b.minX))
  const minY = Math.min(...bounds.map((b) => b.minY))
  const maxX = Math.max(...bounds.map((b) => b.maxX))
  const maxY = Math.max(...bounds.map((b) => b.maxY))

  // Keep border width constant on screen (divide by zoom since canvas is scaled)
  const adjustedBorderWidth = SELECTION_BORDER_WIDTH / zoom
  const adjustedOffset = SELECTION_BORDER_OFFSET / zoom

  ctx.strokeStyle = SELECTION_BORDER_COLOR
  ctx.lineWidth = adjustedBorderWidth
  ctx.strokeRect(
    minX - adjustedOffset,
    minY - adjustedOffset,
    maxX - minX + adjustedBorderWidth,
    maxY - minY + adjustedBorderWidth
  )
}

export function drawPreview(
  ctx: CanvasRenderingContext2D,
  previewRect: PreviewRect | null
): void {
  if (!previewRect || previewRect.width <= 0 || previewRect.height <= 0) return
  ctx.fillStyle = PREVIEW_FILL
  ctx.strokeStyle = PREVIEW_STROKE
  ctx.lineWidth = SHAPE_STROKE_WIDTH
  if (previewRect.isEllipse) {
    fillAndStrokeEllipse(ctx, previewRect)
  } else {
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
}

export function drawPreviewLine(
  ctx: CanvasRenderingContext2D,
  previewLine: PreviewLine | null
): void {
  if (!previewLine) return
  ctx.strokeStyle = PREVIEW_STROKE
  ctx.lineWidth = SHAPE_STROKE_WIDTH
  ctx.beginPath()
  ctx.moveTo(previewLine.x, previewLine.y)
  ctx.lineTo(previewLine.x2, previewLine.y2)
  ctx.stroke()
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
  ctx.arc(0, 0, CROSSHAIR_CENTER_RADIUS, 0, TWO_PI)
  ctx.stroke()
}
