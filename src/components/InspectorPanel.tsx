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
        <div className="from-selection/10 pointer-events-none absolute -inset-1 rounded-2xl bg-linear-to-b to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="border-border bg-card relative rounded-2xl border shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="border-border border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="bg-selection shadow-selection/50 h-2 w-2 rounded-full shadow-lg" />
              <span
                data-testid="inspector-title"
                className="text-muted-foreground font-mono text-xs font-medium tracking-wider uppercase"
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
