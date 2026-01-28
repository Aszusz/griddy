import { useAppSelector } from '../hooks'
import { selectMouseX, selectMouseY } from '../store/selectors'
import { ZoomControl } from './ZoomControl'

function formatCoords(x: number | null, y: number | null): string {
  if (x === null || y === null) return '—, —'
  return `${x}, ${y}`
}

export function StatusBar() {
  const mouseX = useAppSelector(selectMouseX)
  const mouseY = useAppSelector(selectMouseY)
  const hasCoords = mouseX !== null && mouseY !== null

  return (
    <>
      <div
        data-testid="status-bar-coordinates"
        className={`animate-in fade-in fixed bottom-4 left-4 z-40 transition-opacity duration-300 ${hasCoords ? 'opacity-100' : 'opacity-30'}`}
        style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
      >
        <div className="border-border bg-card flex items-center rounded-lg border px-2.5 py-1.5 shadow-lg shadow-black/20 backdrop-blur-md">
          <span className="text-muted-foreground font-mono text-[11px] tracking-tight tabular-nums">
            {formatCoords(mouseX, mouseY)}
          </span>
        </div>
      </div>
      <ZoomControl />
    </>
  )
}
