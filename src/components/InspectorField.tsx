import { useState, useEffect } from 'react'

export function InspectorField({
  label,
  value,
  testId,
  inputTestId,
  onCommit,
}: {
  label: string
  value: string
  testId?: string
  inputTestId?: string
  onCommit?: (value: string) => void
}) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleCommit = () => {
    if (onCommit && localValue !== value) {
      onCommit(localValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommit()
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="w-4 font-mono text-[10px] text-zinc-600">{label}</span>
      <span data-testid={testId} className="hidden">
        {value}
      </span>
      <input
        data-testid={inputTestId}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        className="flex h-7 w-full items-center rounded-lg border border-white/6 bg-white/3 px-2 font-mono text-xs text-zinc-300 outline-none focus:border-cyan-500/50"
      />
    </div>
  )
}
