import { forwardRef } from 'react'
import { ZOOM_PRESETS } from '../constants'

interface ZoomMenuProps {
  zoomPercent: number
  onSelect: (zoom: number) => void
}

export const ZoomMenu = forwardRef<HTMLDivElement, ZoomMenuProps>(
  function ZoomMenu({ zoomPercent, onSelect }, ref) {
    return (
      <div
        ref={ref}
        className="animate-in fade-in slide-in-from-bottom-2 border-border bg-card absolute right-0 bottom-full mb-2 min-w-[100px] rounded-lg border p-1 shadow-xl shadow-black/30 backdrop-blur-xl duration-150"
      >
        {ZOOM_PRESETS.map((preset) => {
          const percent = preset * 100
          const isActive = zoomPercent === percent
          return (
            <button
              key={preset}
              onClick={() => onSelect(preset)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 font-mono text-[11px] transition-colors ${
                isActive
                  ? 'bg-selection/10 text-selection'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <span>{percent}%</span>
              {preset === 1 && (
                <kbd className="border-border bg-accent text-muted-foreground ml-2 rounded border px-1 py-0.5 text-[9px]">
                  ⌘0
                </kbd>
              )}
            </button>
          )
        })}
      </div>
    )
  }
)
