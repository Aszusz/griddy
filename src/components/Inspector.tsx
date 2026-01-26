import { InspectorSection } from './InspectorSection'
import { InspectorField } from './InspectorField'
import { useAppSelector } from '../hooks'
import { selectSelectedShapes } from '../store/selectors'

function InspectorPanel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      data-testid="inspector-panel"
      className="animate-in slide-in-from-right-4 fade-in fixed top-1/2 right-4 z-50 w-56 -translate-y-1/2 duration-150"
    >
      <div className="group relative">
        <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-linear-to-b from-cyan-500/10 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative rounded-2xl border border-white/8 bg-zinc-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="border-b border-white/6 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />
              <span
                data-testid="inspector-title"
                className="font-mono text-xs font-medium tracking-wider text-zinc-400 uppercase"
              >
                {title}
              </span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Inspector() {
  const selectedShapes = useAppSelector(selectSelectedShapes)

  if (selectedShapes.length === 0) {
    return null
  }

  if (selectedShapes.length > 1) {
    return (
      <InspectorPanel title="Selection">
        <div className="px-4 py-3">
          <span
            data-testid="inspector-multi-select-label"
            className="font-mono text-xs text-zinc-400"
          >
            {selectedShapes.length} shapes selected
          </span>
        </div>
      </InspectorPanel>
    )
  }

  const shape = selectedShapes[0]

  return (
    <InspectorPanel title="Rectangle">
      {/* Position Section */}
      <InspectorSection title="Position" delay={50}>
        <div className="grid grid-cols-2 gap-2">
          <InspectorField
            label="X"
            value={String(shape.x)}
            testId="inspector-x"
          />
          <InspectorField
            label="Y"
            value={String(shape.y)}
            testId="inspector-y"
          />
        </div>
      </InspectorSection>

      {/* Size Section */}
      <InspectorSection title="Size" delay={75}>
        <div className="grid grid-cols-2 gap-2">
          <InspectorField
            label="W"
            value={String(shape.width)}
            testId="inspector-width"
          />
          <InspectorField
            label="H"
            value={String(shape.height)}
            testId="inspector-height"
          />
        </div>
      </InspectorSection>

      {/* Fill Section */}
      <InspectorSection title="Fill" delay={100}>
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-lg border border-white/10 shadow-inner"
            style={{ backgroundColor: shape.fill }}
          />
          <span
            data-testid="inspector-fill"
            className="flex h-7 flex-1 items-center rounded-lg border border-white/6 bg-white/3 px-2 font-mono text-xs text-zinc-400"
          >
            {shape.fill}
          </span>
        </div>
      </InspectorSection>

      {/* Stroke Section */}
      <InspectorSection title="Stroke" delay={125} last>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-transparent">
            <div
              className="h-4 w-4 rounded border-2"
              style={{ borderColor: shape.stroke }}
            />
          </div>
          <span
            data-testid="inspector-stroke"
            className="flex h-7 flex-1 items-center rounded-lg border border-white/6 bg-white/3 px-2 font-mono text-xs text-zinc-400"
          >
            {shape.stroke}
          </span>
        </div>
      </InspectorSection>
    </InspectorPanel>
  )
}
