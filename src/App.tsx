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

const toolGroups = [
  [{ icon: MousePointer2, label: 'Select', shortcut: 'V' }],
  [
    { icon: Square, label: 'Rectangle', shortcut: 'R' },
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
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  shortcut: string
  delay: number
}) {
  return (
    <button
      className="animate-in fade-in group/btn relative flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition-all duration-200 hover:bg-white/[0.06] hover:text-cyan-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards',
      }}
      title={`${label} (${shortcut})`}
    >
      <Icon className="h-[18px] w-[18px] transition-transform duration-200 group-hover/btn:scale-110" />
      <span className="pointer-events-none absolute left-full ml-3 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-zinc-900 px-3 py-1.5 font-mono text-xs whitespace-nowrap text-zinc-300 opacity-0 shadow-xl transition-all duration-200 group-hover/btn:opacity-100">
        {label}
        <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-500">
          {shortcut}
        </kbd>
      </span>
    </button>
  )
}

function Toolbox() {
  let toolIndex = 0

  return (
    <div
      className="animate-in slide-in-from-left-4 fade-in fixed top-1/2 left-4 z-50 -translate-y-1/2 duration-500"
      style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
    >
      <div className="group relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex flex-col gap-1 rounded-2xl border border-white/[0.08] bg-zinc-900/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {toolGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-1">
              {groupIndex > 0 && (
                <div className="mx-2 my-0.5 h-px bg-white/[0.04]" />
              )}
              {group.map((tool) => {
                const delay = 300 + toolIndex * 50
                toolIndex++
                return <ToolButton key={tool.label} {...tool} delay={delay} />
              })}
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
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative rounded-2xl border border-white/[0.08] bg-zinc-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-white/[0.06] px-4 py-3">
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
              <div className="h-7 w-7 rounded-lg border border-white/10 bg-gradient-to-br from-zinc-700 to-zinc-800 shadow-inner" />
              <input
                type="text"
                readOnly
                value="#3F3F46"
                className="h-7 flex-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 font-mono text-xs text-zinc-400 transition-colors outline-none focus:border-cyan-500/50"
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
                className="h-7 flex-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 font-mono text-xs text-zinc-500 transition-colors outline-none focus:border-cyan-500/50"
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
      className={`animate-in fade-in px-4 py-3 ${!last ? 'border-b border-white/[0.04]' : ''}`}
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
        className="h-7 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 font-mono text-xs text-zinc-300 transition-colors outline-none focus:border-cyan-500/50"
      />
    </div>
  )
}

function Canvas() {
  return (
    <div
      className="animate-in fade-in absolute inset-0 duration-700"
      style={{
        backgroundColor: '#0a0a0b',
        backgroundImage: `
          radial-gradient(circle at center, rgba(34, 211, 238, 0.015) 0%, transparent 70%),
          radial-gradient(circle, rgba(255, 255, 255, 0.13) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 20px 20px',
        backgroundPosition: 'center, center',
      }}
    >
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
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="h-2 w-2 rounded-full border border-cyan-500/30" />
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          </div>
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
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
