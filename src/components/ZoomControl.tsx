import { useRef, useState, useEffect } from 'react'
import { ChevronDown, Minus, Plus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AppActions } from '../store/actions'
import { selectZoom } from '../store/selectors'
import { MIN_ZOOM, MAX_ZOOM } from '../constants'
import { ZoomMenu } from './ZoomMenu'

export function ZoomControl() {
  const dispatch = useAppDispatch()
  const zoom = useAppSelector(selectZoom)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const zoomPercent = Math.round(zoom * 100)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleZoomIn = () => dispatch(AppActions['zoom/in']())
  const handleZoomOut = () => dispatch(AppActions['zoom/out']())
  const handleZoomSet = (z: number) => {
    dispatch(AppActions['zoom/set'](z))
    setShowMenu(false)
  }

  return (
    <div
      className="animate-in fade-in fixed right-4 bottom-4 z-40"
      style={{ animationDelay: '650ms', animationFillMode: 'backwards' }}
    >
      <div className="flex items-center gap-1 rounded-lg border border-white/4 bg-zinc-900/80 p-1 shadow-lg shadow-black/20 backdrop-blur-md">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500"
          title="Zoom out (⌘−)"
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>

        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            data-testid="status-bar-zoom"
            className="flex h-7 min-w-[60px] items-center justify-center gap-1 rounded-md px-2 font-mono text-[11px] text-zinc-400 tabular-nums transition-colors hover:bg-white/5 hover:text-zinc-200"
          >
            <span>{zoomPercent}%</span>
            <ChevronDown
              className={`h-3 w-3 text-zinc-600 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`}
              strokeWidth={1.5}
            />
          </button>

          {showMenu && (
            <ZoomMenu
              ref={menuRef}
              zoomPercent={zoomPercent}
              onSelect={handleZoomSet}
            />
          )}
        </div>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500"
          title="Zoom in (⌘+)"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
