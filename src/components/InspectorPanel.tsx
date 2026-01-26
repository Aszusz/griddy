export function InspectorPanel({
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
