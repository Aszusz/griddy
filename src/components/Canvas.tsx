import { useMemo } from 'react'
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

export function Canvas() {
  const dispatch = useAppDispatch()
  const activeTool = useAppSelector(selectActiveTool)
  const shapes = useAppSelector(selectShapes)
  const drawing = useAppSelector(selectDrawing)

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool !== 'rectangle') return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    dispatch(AppActions['drawing/started'](x, y))
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drawing) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    dispatch(AppActions['drawing/moved'](x, y))
  }

  const handleMouseUp = () => {
    if (!drawing) return
    dispatch(AppActions['drawing/ended']())
  }

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

  return (
    <div
      data-testid="canvas-container"
      className="animate-in fade-in absolute inset-0 duration-700"
      style={{
        backgroundColor: CANVAS_BG,
        backgroundImage: `
          radial-gradient(circle at center, rgba(34, 211, 238, 0.015) 0%, transparent 70%),
          radial-gradient(circle, rgba(255, 255, 255, 0.13) 1px, transparent 1px)
        `,
        backgroundSize: `100% 100%, ${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundPosition: `0 0, ${-GRID_SIZE / 2}px ${-GRID_SIZE / 2}px`,
      }}
    >
      <svg
        data-testid="canvas"
        className="absolute inset-0 h-full w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {shapes.map((shape) => (
          <rect
            key={shape.id}
            data-testid="shape-rectangle"
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={SHAPE_FILL}
            stroke={SHAPE_STROKE}
            strokeWidth={2}
          />
        ))}
        {previewRect && previewRect.width > 0 && previewRect.height > 0 && (
          <rect
            data-testid="shape-preview"
            x={previewRect.x}
            y={previewRect.y}
            width={previewRect.width}
            height={previewRect.height}
            fill={PREVIEW_FILL}
            stroke={SHAPE_STROKE}
            strokeWidth={2}
            strokeDasharray="4"
          />
        )}
      </svg>

      {/* Subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Center crosshair hint - fixed position at (400, 300) */}
      <svg
        className="pointer-events-none absolute"
        width="34"
        height="34"
        style={{ top: 300 - 17, left: 400 - 17 }}
      >
        <line
          x1="17"
          y1="0"
          x2="17"
          y2="34"
          stroke="rgb(34, 211, 238)"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="17"
          x2="34"
          y2="17"
          stroke="rgb(34, 211, 238)"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
        <circle
          cx="17"
          cy="17"
          r="3"
          fill="none"
          stroke="rgb(34, 211, 238)"
          strokeOpacity="0.5"
        />
      </svg>

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
