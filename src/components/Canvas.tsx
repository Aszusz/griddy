import { useEffect, useMemo, useRef, useState } from 'react'
import {
  GRID_SIZE,
  CANVAS_BG,
  PREVIEW_FILL,
  PREVIEW_STROKE,
  GRID_DOT_COLOR,
  GRID_DOT_RADIUS,
  CROSSHAIR_COLOR,
  CROSSHAIR_SIZE,
  CROSSHAIR_CENTER_RADIUS,
  SHAPE_STROKE_WIDTH,
  SELECTION_BORDER_COLOR,
  SELECTION_BORDER_WIDTH,
  SELECTION_BORDER_OFFSET,
  SELECTION_HANDLE_SIZE,
  SELECTION_HANDLE_FILL,
  SELECTION_HANDLE_STROKE_WIDTH,
  MARQUEE_FILL,
  MARQUEE_DASH_PATTERN,
} from '../constants'
import { snapToGrid, pointInRect } from '../utils'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AppActions } from '../store/actions'
import {
  selectActiveTool,
  selectShapes,
  selectDrawing,
  selectSelectedIds,
  selectMarquee,
  selectResize,
  selectMove,
} from '../store/selectors'
import type { HandlePosition } from '../store/state'

type ShapeBounds = { x: number; y: number; width: number; height: number }

const HANDLE_POSITIONS: {
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

export function Canvas() {
  const dispatch = useAppDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeTool = useAppSelector(selectActiveTool)
  const shapes = useAppSelector(selectShapes)
  const drawing = useAppSelector(selectDrawing)
  const selectedIds = useAppSelector(selectSelectedIds)
  const marquee = useAppSelector(selectMarquee)
  const resize = useAppSelector(selectResize)
  const move = useAppSelector(selectMove)
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [hoverCursor, setHoverCursor] = useState('auto')

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
      ctx.fillStyle = shape.fill
      ctx.strokeStyle = shape.stroke
      ctx.lineWidth = SHAPE_STROKE_WIDTH
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
    })

    // Draw single selection bounding box around all selected shapes
    const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))
    if (selectedShapes.length > 0) {
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

    // Draw marquee selection box
    if (marquee) {
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
  }, [shapes, previewRect, canvasSize, originX, originY, selectedIds, marquee])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - originX
    const y = e.clientY - rect.top - originY

    if (activeTool === 'rectangle') {
      dispatch(AppActions['drawing/started'](x, y))
    } else if (activeTool === 'select') {
      const clickedShape = shapes.find((s) => pointInRect(x, y, s))
      if (clickedShape) {
        const isAlreadySelected = selectedIds.includes(clickedShape.id)
        if (e.shiftKey) {
          // Shift-click toggles selection, no move
          dispatch(AppActions['selection/clicked'](x, y, e.shiftKey))
        } else {
          if (!isAlreadySelected) {
            dispatch(AppActions['selection/clicked'](x, y, false))
          }
          dispatch(AppActions['move/started'](x, y))
        }
      } else {
        dispatch(AppActions['marquee/started'](x, y))
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - originX
    const y = e.clientY - rect.top - originY

    if (drawing) {
      dispatch(AppActions['drawing/moved'](x, y))
    } else if (marquee) {
      dispatch(AppActions['marquee/moved'](x, y))
    } else if (move) {
      dispatch(AppActions['move/moved'](x, y))
    }

    // Update cursor for hover state
    if (activeTool === 'select' && !drawing && !marquee && !resize) {
      const hoveredShape = shapes.find((s) => pointInRect(x, y, s))
      if (hoveredShape && selectedIds.includes(hoveredShape.id)) {
        setHoverCursor('move')
      } else {
        setHoverCursor('auto')
      }
    } else {
      setHoverCursor('auto')
    }
  }

  const handleMouseUp = () => {
    if (drawing) {
      dispatch(AppActions['drawing/ended']())
    } else if (marquee) {
      dispatch(AppActions['marquee/ended']())
    } else if (move) {
      dispatch(AppActions['move/ended']())
    }
  }

  // Global mouse listeners to handle drag outside canvas
  useEffect(() => {
    if (!drawing && !marquee && !move) return
    const canvas = canvasRef.current
    if (!canvas) return

    const onGlobalMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left - originX
      const y = e.clientY - rect.top - originY
      if (drawing) dispatch(AppActions['drawing/moved'](x, y))
      if (marquee) dispatch(AppActions['marquee/moved'](x, y))
      if (move) dispatch(AppActions['move/moved'](x, y))
    }
    const onGlobalMouseUp = () => {
      if (drawing) dispatch(AppActions['drawing/ended']())
      if (marquee) dispatch(AppActions['marquee/ended']())
      if (move) dispatch(AppActions['move/ended']())
    }
    window.addEventListener('mousemove', onGlobalMouseMove)
    window.addEventListener('mouseup', onGlobalMouseUp)
    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove)
      window.removeEventListener('mouseup', onGlobalMouseUp)
    }
  }, [drawing, marquee, move, dispatch, originX, originY])

  // Resize handles global listeners
  useEffect(() => {
    if (!resize) return
    const canvas = canvasRef.current
    if (!canvas) return

    const onGlobalMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left - originX
      const y = e.clientY - rect.top - originY
      dispatch(AppActions['resize/moved'](x, y))
    }
    const onGlobalMouseUp = () => {
      dispatch(AppActions['resize/ended']())
    }
    window.addEventListener('mousemove', onGlobalMouseMove)
    window.addEventListener('mouseup', onGlobalMouseUp)
    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove)
      window.removeEventListener('mouseup', onGlobalMouseUp)
    }
  }, [resize, dispatch, originX, originY])

  // Get single selected shape for resize handles
  const singleSelectedShape =
    selectedIds.length === 1
      ? shapes.find((s) => s.id === selectedIds[0])
      : undefined

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    position: HandlePosition
  ) => {
    e.stopPropagation()
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - originX
    const y = e.clientY - rect.top - originY
    dispatch(AppActions['resize/started'](position, x, y))
  }

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
        style={{ cursor: hoverCursor }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* Resize handles - only for single selection */}
      {singleSelectedShape &&
        HANDLE_POSITIONS.map(({ position, cursor, getOffset }) => {
          const offset = getOffset(singleSelectedShape)
          return (
            <div
              key={position}
              data-testid={`resize-handle-${position}`}
              onMouseDown={(e) => handleResizeMouseDown(e, position)}
              style={{
                position: 'absolute',
                left: originX + offset.x - SELECTION_HANDLE_SIZE / 2,
                top: originY + offset.y - SELECTION_HANDLE_SIZE / 2,
                width: SELECTION_HANDLE_SIZE,
                height: SELECTION_HANDLE_SIZE,
                backgroundColor: SELECTION_HANDLE_FILL,
                border: `${SELECTION_HANDLE_STROKE_WIDTH}px solid ${SELECTION_BORDER_COLOR}`,
                cursor,
                boxSizing: 'border-box',
              }}
            />
          )
        })}

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
