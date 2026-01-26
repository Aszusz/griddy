import {
  MousePointer2,
  Square,
  Circle,
  MoveRight,
  Minus,
  Type,
  ZoomIn,
  Hand,
} from 'lucide-react'
import { useMemo } from 'react'
import { GRID_SIZE, SHAPE_FILL, SHAPE_STROKE, PREVIEW_FILL } from './constants'
import { snapToGrid } from './utils'
import { useAppDispatch, useAppSelector } from './hooks'
import { AppActions } from './store/actions'
import {
  selectActiveTool,
  selectShapes,
  selectDrawing,
} from './store/selectors'
import type { Tool } from './store/state'

type ToolDef = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  shortcut: string
  tool?: Tool
  testId?: string
}

const toolGroups: ToolDef[][] = [
  [{ icon: MousePointer2, label: 'Select', shortcut: 'V', tool: 'select' }],
  [
    {
      icon: Square,
      label: 'Rectangle',
      shortcut: 'R',
      tool: 'rectangle',
      testId: 'toolbox-rectangle',
    },
    { icon: Circle, label: 'Ellipse', shortcut: 'O' },
  ],
  [
    { icon: MoveRight, label: 'Arrow', shortcut: 'A' },
    { icon: Minus, label: 'Line', shortcut: 'L' },
  ],
  [{ icon: Type, label: 'Text', shortcut: 'T' }],
  [
    { icon: ZoomIn, label: 'Zoom', shortcut: 'Z' },
    { icon: Hand, label: 'Pan', shortcut: 'H' },
  ],
]

function ToolButton({
  icon: Icon,
  label,
  shortcut,
  delay,
  testId,
  isActive,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  shortcut: string
  delay: number
  testId?: string
  isActive: boolean
  onClick?: () => void
}) {
  return (
    <button
      data-testid={testId}
      data-active={isActive}
      onClick={onClick}
      className={`animate-in fade-in group/btn relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/6 hover:text-cyan-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 ${isActive ? 'bg-white/10 text-cyan-400' : 'text-zinc-500'}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards',
      }}
      title={`${label} (${shortcut})`}
    >
      <Icon className="h-[18px] w-[18px] transition-transform duration-200 group-hover/btn:scale-110" />
      <span className="pointer-events-none absolute left-full ml-3 flex items-center gap-2 rounded-lg border border-white/8 bg-zinc-900 px-3 py-1.5 font-mono text-xs whitespace-nowrap text-zinc-300 opacity-0 shadow-xl transition-all duration-200 group-hover/btn:opacity-100">
        {label}
        <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-500">
          {shortcut}
        </kbd>
      </span>
    </button>
  )
}

// Pre-compute tool items with global indices for animation delays
const toolItems = toolGroups.flatMap((group, groupIndex) =>
  group.map((toolDef, indexInGroup) => ({
    ...toolDef,
    groupIndex,
    isFirstInGroup: indexInGroup === 0,
  }))
)

function Toolbox() {
  const dispatch = useAppDispatch()
  const activeTool = useAppSelector(selectActiveTool)

  return (
    <div
      className="animate-in slide-in-from-left-4 fade-in fixed top-1/2 left-4 z-50 -translate-y-1/2 duration-500"
      style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
    >
      <div className="group relative">
        <div className="absolute -inset-1 rounded-2xl bg-linear-to-b from-cyan-500/20 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex flex-col gap-1 rounded-2xl border border-white/8 bg-zinc-900/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {toolItems.map((item, index) => (
            <div key={item.label} className="flex flex-col gap-1">
              {item.isFirstInGroup && item.groupIndex > 0 && (
                <div className="mx-2 my-0.5 h-px bg-white/4" />
              )}
              <ToolButton
                {...item}
                delay={300 + index * 50}
                isActive={item.tool === activeTool}
                onClick={
                  item.tool
                    ? () => dispatch(AppActions['tool/selected'](item.tool!))
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Inspector() {
  return (
    <div
      className="animate-in slide-in-from-right-4 fade-in fixed top-1/2 right-4 z-50 w-56 -translate-y-1/2 duration-500"
      style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
    >
      <div className="group relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-linear-to-b from-cyan-500/10 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative rounded-2xl border border-white/8 bg-zinc-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-white/6 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />
              <span className="font-mono text-xs font-medium tracking-wider text-zinc-400">
                INSPECTOR
              </span>
            </div>
          </div>

          {/* Position Section */}
          <InspectorSection title="Position" delay={400}>
            <div className="grid grid-cols-2 gap-2">
              <InspectorField label="X" value="0" />
              <InspectorField label="Y" value="0" />
            </div>
          </InspectorSection>

          {/* Size Section */}
          <InspectorSection title="Size" delay={450}>
            <div className="grid grid-cols-2 gap-2">
              <InspectorField label="W" value="100" />
              <InspectorField label="H" value="100" />
            </div>
          </InspectorSection>

          {/* Fill Section */}
          <InspectorSection title="Fill" delay={500}>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg border border-white/10 bg-linear-to-br from-zinc-700 to-zinc-800 shadow-inner" />
              <input
                type="text"
                readOnly
                value="#3F3F46"
                className="h-7 flex-1 rounded-lg border border-white/6 bg-white/3 px-2 font-mono text-xs text-zinc-400 transition-colors outline-none focus:border-cyan-500/50"
              />
            </div>
          </InspectorSection>

          {/* Stroke Section */}
          <InspectorSection title="Stroke" delay={550} last>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-transparent">
                <div className="h-4 w-4 rounded border-2 border-zinc-500" />
              </div>
              <input
                type="text"
                readOnly
                value="None"
                className="h-7 flex-1 rounded-lg border border-white/6 bg-white/3 px-2 font-mono text-xs text-zinc-500 transition-colors outline-none focus:border-cyan-500/50"
              />
            </div>
          </InspectorSection>
        </div>
      </div>
    </div>
  )
}

function InspectorSection({
  title,
  children,
  delay,
  last = false,
}: {
  title: string
  children: React.ReactNode
  delay: number
  last?: boolean
}) {
  return (
    <div
      className={`animate-in fade-in px-4 py-3 ${!last ? 'border-b border-white/4' : ''}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="mb-2 font-mono text-[10px] font-medium tracking-widest text-zinc-600">
        {title}
      </div>
      {children}
    </div>
  )
}

function InspectorField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-4 font-mono text-[10px] text-zinc-600">{label}</span>
      <input
        type="text"
        readOnly
        value={value}
        className="h-7 w-full rounded-lg border border-white/6 bg-white/3 px-2 font-mono text-xs text-zinc-300 transition-colors outline-none focus:border-cyan-500/50"
      />
    </div>
  )
}

function Canvas() {
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
        backgroundColor: '#0a0a0b',
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

      {/* Center crosshair hint */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center gap-4 opacity-20">
          <div className="h-8 w-px bg-linear-to-b from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="h-2 w-2 rounded-full border border-cyan-500/30" />
            <div className="h-px w-8 bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />
          </div>
          <div className="h-8 w-px bg-linear-to-b from-transparent via-cyan-500/50 to-transparent" />
        </div>
      </div>

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

function App() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <Canvas />
      <Toolbox />
      <Inspector />
    </div>
  )
}

export default App
