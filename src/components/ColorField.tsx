import { useState, useEffect } from 'react'

function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

export function ColorField({
  value,
  testId,
  inputTestId,
  previewBorder,
  onCommit,
}: {
  value: string
  testId: string
  inputTestId: string
  previewBorder?: boolean
  onCommit: (value: string) => void
}) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleCommit = () => {
    if (isValidHexColor(localValue)) {
      if (localValue !== value) {
        onCommit(localValue)
      }
    } else {
      setLocalValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommit()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {previewBorder ? (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-transparent">
          <div
            className="h-4 w-4 rounded border-2"
            style={{ borderColor: value }}
          />
        </div>
      ) : (
        <div
          className="h-7 w-7 rounded-lg border border-white/10 shadow-inner"
          style={{ backgroundColor: value }}
        />
      )}
      <div className="relative flex-1">
        <span
          data-testid={testId}
          className="pointer-events-none absolute inset-0 flex h-7 items-center px-2 font-mono text-xs text-transparent"
        >
          {value}
        </span>
        <input
          data-testid={inputTestId}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleCommit}
          onKeyDown={handleKeyDown}
          className="flex h-7 w-full items-center rounded-lg border border-white/6 bg-white/3 px-2 font-mono text-xs text-zinc-400 outline-none focus:border-cyan-500/50"
        />
      </div>
    </div>
  )
}
