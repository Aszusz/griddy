export function InspectorField({
  label,
  value,
}: {
  label: string
  value: string
}) {
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
