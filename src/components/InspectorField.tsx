export function InspectorField({
  label,
  value,
  testId,
}: {
  label: string
  value: string
  testId?: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-4 font-mono text-[10px] text-zinc-600">{label}</span>
      <span
        data-testid={testId}
        className="flex h-7 w-full items-center rounded-lg border border-white/6 bg-white/3 px-2 font-mono text-xs text-zinc-300"
      >
        {value}
      </span>
    </div>
  )
}
