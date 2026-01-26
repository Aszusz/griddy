import { useEffect, useMemo, useRef, useState } from 'react'
import {
  GRID_SIZE,
  CANVAS_BG,
  SHAPE_FILL,
  SHAPE_STROKE,
  PREVIEW_FILL,
  PREVIEW_STROKE,
  GRID_DOT_COLOR,
  GRID_DOT_RADIUS,
  CROSSHAIR_COLOR,
  CROSSHAIR_SIZE,
  CROSSHAIR_CENTER_RADIUS,
  SHAPE_STROKE_WIDTH,
} from '../constants'
import { snapToGrid } from '../utils'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AppActions } from '../store/actions'
import {
  selectActiveTool,
  selectShapes,
  selectDrawing,
} from '../store/selectors'

export function Canvas() {
  const dispatch = useAppDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeTool = useAppSelector(selectActiveTool)
  const shapes = useAppSelector(selectShapes)
  const drawing = useAppSelector(selectDrawing)
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const originX = canvasSize.width / 2
  const originY = canvasSize.height / 2

  // Handle viewport resize using ResizeObserver for reliable updates
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        const { width, height } = entry.contentRect
        setCanvasSize({ width, height })
        dispatch(AppActions['viewport/resized'](width, height))
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [dispatch])

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
    ctx.translate(originX, originY)

    // Draw grid dots
    ctx.fillStyle = GRID_DOT_COLOR
    const startX = -originX - (((-originX % GRID_SIZE) + GRID_SIZE) % GRID_SIZE)
    const startY = -originY - (((-originY % GRID_SIZE) + GRID_SIZE) % GRID_SIZE)
    for (let x = startX; x < canvasSize.width - originX; x += GRID_SIZE) {
      for (let y = startY; y < canvasSize.height - originY; y += GRID_SIZE) {
        ctx.beginPath()
        ctx.arc(x, y, GRID_DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw shapes
    shapes.forEach((shape) => {
      ctx.fillStyle = SHAPE_FILL
      ctx.strokeStyle = SHAPE_STROKE
      ctx.lineWidth = SHAPE_STROKE_WIDTH
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
    })

    // Draw preview
    if (previewRect && previewRect.width > 0 && previewRect.height > 0) {
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

    // Draw crosshair at origin (0,0)
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

    ctx.restore()
  }, [shapes, previewRect, canvasSize, originX, originY])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'rectangle') return
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - originX
    const y = e.clientY - rect.top - originY
    dispatch(AppActions['drawing/started'](x, y))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - originX
    const y = e.clientY - rect.top - originY
    dispatch(AppActions['drawing/moved'](x, y))
  }

  const handleMouseUp = () => {
    if (!drawing) return
    dispatch(AppActions['drawing/ended']())
  }

  // Global mouseup listener to handle release outside canvas
  useEffect(() => {
    if (!drawing) return
    const onGlobalMouseUp = () => dispatch(AppActions['drawing/ended']())
    window.addEventListener('mouseup', onGlobalMouseUp)
    return () => window.removeEventListener('mouseup', onGlobalMouseUp)
  }, [drawing, dispatch])

  return (
    <div
      ref={containerRef}
      data-testid="canvas-container"
      className="animate-in fade-in absolute inset-0 duration-700"
      style={{ backgroundColor: CANVAS_BG }}
    >
      <canvas
        ref={canvasRef}
        data-testid="canvas"
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
