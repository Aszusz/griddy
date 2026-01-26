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
import { useAppDispatch, useAppSelector } from '../hooks'
import { AppActions } from '../store/actions'
import { selectActiveTool } from '../store/selectors'
import type { Tool } from '../store/state'
import { ToolButton } from './ToolButton'

type ToolDef = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  shortcut: string
  tool?: Tool
  testId?: string
}

const toolGroups: ToolDef[][] = [
  [
    {
      icon: MousePointer2,
      label: 'Select',
      shortcut: 'V',
      tool: 'select',
      testId: 'toolbox-selection',
    },
  ],
  [
    {
      icon: Square,
      label: 'Rectangle',
      shortcut: 'R',
      tool: 'rectangle',
      testId: 'toolbox-rectangle',
    },
    {
      icon: Circle,
      label: 'Ellipse',
      shortcut: 'E',
      tool: 'ellipse',
      testId: 'toolbox-ellipse',
    },
  ],
  [
    { icon: MoveRight, label: 'Arrow', shortcut: 'A' },
    {
      icon: Minus,
      label: 'Line',
      shortcut: 'L',
      tool: 'line',
      testId: 'toolbox-line',
    },
  ],
  [{ icon: Type, label: 'Text', shortcut: 'T' }],
  [
    { icon: ZoomIn, label: 'Zoom', shortcut: 'Z' },
    {
      icon: Hand,
      label: 'Pan',
      shortcut: 'H',
      tool: 'pan',
      testId: 'toolbox-pan',
    },
  ],
]

// Pre-compute tool items with global indices for animation delays
const toolItems = toolGroups.flatMap((group, groupIndex) =>
  group.map((toolDef, indexInGroup) => ({
    ...toolDef,
    groupIndex,
    isFirstInGroup: indexInGroup === 0,
  }))
)

export function Toolbox() {
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
