export function InspectorSection({
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
