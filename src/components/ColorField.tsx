import { useState, useEffect, useRef } from 'react'
import { FILL_PALETTE, STROKE_PALETTE } from '../constants'

function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

export function ColorField({
  value,
  testId,
  inputTestId,
  swatchTestId,
  previewBorder,
  paletteType = 'fill',
  onCommit,
}: {
  value: string
  testId: string
  inputTestId: string
  swatchTestId?: string
  previewBorder?: boolean
  paletteType?: 'fill' | 'stroke'
  onCommit: (value: string) => void
}) {
  const [localValue, setLocalValue] = useState(value)
  const [showPalette, setShowPalette] = useState(false)
  const paletteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (!showPalette) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        paletteRef.current &&
        !paletteRef.current.contains(e.target as Node)
      ) {
        setShowPalette(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPalette])

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

  const handleSwatchClick = () => {
    setShowPalette(!showPalette)
  }

  const handlePaletteColorClick = (hex: string) => {
    onCommit(hex)
    setShowPalette(false)
  }

  return (
    <div className="relative flex items-center gap-2">
      {previewBorder ? (
        <button
          data-testid={swatchTestId}
          onClick={handleSwatchClick}
          className="border-border flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border bg-transparent"
        >
          <div
            className="h-4 w-4 rounded border-2"
            style={{ borderColor: value }}
          />
        </button>
      ) : (
        <button
          data-testid={swatchTestId}
          onClick={handleSwatchClick}
          className="border-border h-7 w-7 cursor-pointer rounded-lg border shadow-inner"
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
          className="border-border bg-accent text-muted-foreground focus:border-selection/50 flex h-7 w-full items-center rounded-lg border px-2 font-mono text-xs outline-none"
        />
      </div>
      {showPalette && (
        <div
          ref={paletteRef}
          data-testid="inspector-color-palette"
          className="border-border bg-popover absolute top-full left-0 z-50 mt-1 grid grid-cols-5 gap-1 rounded-lg border p-2 shadow-lg"
        >
          {(paletteType === 'fill' ? FILL_PALETTE : STROKE_PALETTE).map(
            (color) => (
              <button
                key={color.name}
                data-testid={`inspector-palette-${color.name}`}
                onClick={() => handlePaletteColorClick(color.hex)}
                className="border-border h-6 w-6 cursor-pointer rounded border"
                style={{ backgroundColor: color.hex }}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}
