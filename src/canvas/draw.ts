import type { Shape, MarqueeState } from '../store/state'
import { isLineShape, isTextShape } from '../utils'
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
  FONT_MAP,
  TEXT_FONT_SIZE,
  TEXT_LINE_HEIGHT,
  TEXT_PADDING,
  TEXT_PREVIEW_FILL,
  TEXT_DASH_PATTERN,
} from '../constants'

type Rect = { x: number; y: number; width: number; height: number }
type PreviewRect = Rect & { isEllipse: boolean }
type PreviewLine = { x: number; y: number; x2: number; y2: number }
type PreviewText = Rect

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

function breakWord(
  ctx: CanvasRenderingContext2D,
  word: string,
  maxWidth: number
): string[] {
  const parts: string[] = []
  let current = ''
  for (const char of word) {
    const test = current + char
    if (ctx.measureText(test).width > maxWidth && current) {
      parts.push(current)
      current = char
    } else {
      current = test
    }
  }
  if (current) parts.push(current)
  return parts
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = []
  const paragraphs = text.split('\n')

  for (const paragraph of paragraphs) {
    if (paragraph === '') {
      lines.push('')
      continue
    }

    const words = paragraph.split(' ')
    let currentLine = ''

    for (const word of words) {
      // Break word if it's too long by itself
      if (ctx.measureText(word).width > maxWidth) {
        if (currentLine) {
          lines.push(currentLine)
          currentLine = ''
        }
        const broken = breakWord(ctx, word, maxWidth)
        for (let i = 0; i < broken.length - 1; i++) {
          lines.push(broken[i])
        }
        currentLine = broken[broken.length - 1] || ''
        continue
      }

      const testLine = currentLine ? `${currentLine} ${word}` : word
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) {
      lines.push(currentLine)
    }
  }
  return lines
}

export function drawShapes(
  ctx: CanvasRenderingContext2D,
  shapes: Shape[],
  editingTextId?: string | null
): void {
  shapes.forEach((shape) => {
    if (isTextShape(shape)) {
      // Don't draw text shape if it's being edited (will be rendered as HTML)
      if (shape.id === editingTextId) return
      ctx.save()
      ctx.beginPath()
      ctx.rect(shape.x, shape.y, shape.width, shape.height)
      ctx.clip()
      ctx.fillStyle = shape.fill
      ctx.font = `${TEXT_FONT_SIZE}px ${FONT_MAP[shape.fontFamily]}`
      ctx.textBaseline = 'top'
      ctx.textAlign = shape.align
      const lines = wrapText(ctx, shape.text, shape.width - TEXT_PADDING * 2)
      const xOffset =
        shape.align === 'center'
          ? shape.width / 2
          : shape.align === 'right'
            ? shape.width - TEXT_PADDING
            : TEXT_PADDING
      lines.forEach((line, i) => {
        ctx.fillText(
          line,
          shape.x + xOffset,
          shape.y + TEXT_PADDING + i * TEXT_LINE_HEIGHT
        )
      })
      ctx.restore()
    } else if (isLineShape(shape)) {
      ctx.strokeStyle = shape.stroke
      ctx.lineWidth = SHAPE_STROKE_WIDTH
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
      ctx.strokeStyle = shape.stroke
      ctx.lineWidth = SHAPE_STROKE_WIDTH
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

export function drawPreviewText(
  ctx: CanvasRenderingContext2D,
  previewText: PreviewText | null
): void {
  if (!previewText || previewText.width <= 0 || previewText.height <= 0) return
  ctx.fillStyle = TEXT_PREVIEW_FILL
  ctx.strokeStyle = PREVIEW_STROKE
  ctx.lineWidth = SHAPE_STROKE_WIDTH
  ctx.setLineDash([...TEXT_DASH_PATTERN])
  ctx.fillRect(
    previewText.x,
    previewText.y,
    previewText.width,
    previewText.height
  )
  ctx.strokeRect(
    previewText.x,
    previewText.y,
    previewText.width,
    previewText.height
  )
  ctx.setLineDash([])
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
