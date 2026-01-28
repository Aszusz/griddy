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
      className={`animate-in fade-in px-4 py-3 duration-100 ${!last ? 'border-border border-b' : ''}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="text-muted-foreground mb-2 font-mono text-[10px] font-medium tracking-widest">
        {title}
      </div>
      {children}
    </div>
  )
}
