export function ToolButton({
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
