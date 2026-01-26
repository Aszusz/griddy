import { useEffect, useMemo, useRef } from 'react'
import {
  GRID_SIZE,
  CANVAS_BG,
  SHAPE_FILL,
  SHAPE_STROKE,
  PREVIEW_FILL,
} from '../constants'
import { snapToGrid } from '../utils'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AppActions } from '../store/actions'
import {
  selectActiveTool,
  selectShapes,
  selectDrawing,
} from '../store/selectors'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const ORIGIN_X = CANVAS_WIDTH / 2
const ORIGIN_Y = CANVAS_HEIGHT / 2

export function Canvas() {
  const dispatch = useAppDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeTool = useAppSelector(selectActiveTool)
  const shapes = useAppSelector(selectShapes)
  const drawing = useAppSelector(selectDrawing)

  const previewRect = useMemo(() => {
    if (!drawing) return null
    return {
      x: snapToGrid(Math.min(drawing.startX, drawing.currentX)),
      y: snapToGrid(Math.min(drawing.startY, drawing.currentY)),
      width:
        snapToGrid(Math.max(drawing.startX, drawing.currentX)) -
        snapToGrid(Math.min(drawing.startX, drawing.currentX)),
      height:
        snapToGrid(Math.max(drawing.startY, drawing.currentY)) -
        snapToGrid(Math.min(drawing.startY, drawing.currentY)),
    }
  }, [drawing])

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(ORIGIN_X, ORIGIN_Y)

    // Draw grid dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.13)'
    const startX = -ORIGIN_X - (-ORIGIN_X % GRID_SIZE)
    const startY = -ORIGIN_Y - (-ORIGIN_Y % GRID_SIZE)
    for (let x = startX; x < CANVAS_WIDTH - ORIGIN_X; x += GRID_SIZE) {
      for (let y = startY; y < CANVAS_HEIGHT - ORIGIN_Y; y += GRID_SIZE) {
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw shapes
    shapes.forEach((shape) => {
      ctx.fillStyle = SHAPE_FILL
      ctx.strokeStyle = SHAPE_STROKE
      ctx.lineWidth = 2
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
    })

    // Draw preview (dashed)
    if (previewRect && previewRect.width > 0 && previewRect.height > 0) {
      ctx.fillStyle = PREVIEW_FILL
      ctx.strokeStyle = SHAPE_STROKE
      ctx.lineWidth = 2
      ctx.setLineDash([4])
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
      ctx.setLineDash([])
    }

    // Draw crosshair at origin (0,0)
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, -17)
    ctx.lineTo(0, 17)
    ctx.moveTo(-17, 0)
    ctx.lineTo(17, 0)
    ctx.stroke()
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)'
    ctx.beginPath()
    ctx.arc(0, 0, 3, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
  }, [shapes, previewRect])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'rectangle') return
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - ORIGIN_X
    const y = e.clientY - rect.top - ORIGIN_Y
    dispatch(AppActions['drawing/started'](x, y))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - ORIGIN_X
    const y = e.clientY - rect.top - ORIGIN_Y
    dispatch(AppActions['drawing/moved'](x, y))
  }

  const handleMouseUp = () => {
    if (!drawing) return
    dispatch(AppActions['drawing/ended']())
  }

  return (
    <div
      data-testid="canvas-container"
      className="animate-in fade-in absolute inset-0 duration-700"
      style={{ backgroundColor: CANVAS_BG }}
    >
      <canvas
        ref={canvasRef}
        data-testid="canvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Coordinate display */}
      <div
        className="animate-in fade-in absolute bottom-4 left-4 flex items-center gap-3 font-mono text-[10px] tracking-wider text-zinc-600 duration-500"
        style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
      >
        <span>0, 0</span>
        <span className="text-zinc-700">•</span>
        <span>100%</span>
      </div>
    </div>
  )
}
