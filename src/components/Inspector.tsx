import { InspectorSection } from './InspectorSection'
import { InspectorField } from './InspectorField'

export function Inspector() {
  return (
    <div
      className="animate-in slide-in-from-right-4 fade-in pointer-events-none fixed top-1/2 right-4 z-50 w-56 -translate-y-1/2 duration-500"
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
