import { useRef } from 'react'
import type { LineShape } from '../store/state'
import { useAppDispatch } from '../hooks'
import { AppActions } from '../store/actions'
import {
  SELECTION_HANDLE_SIZE,
  SELECTION_HANDLE_FILL,
  SELECTION_HANDLE_STROKE_WIDTH,
  SELECTION_BORDER_COLOR,
} from '../constants'

type Props = {
  line: LineShape | undefined
  originX: number
  originY: number
  zoom?: number
}

export function LineEndpointHandles({
  line,
  originX,
  originY,
  zoom = 1,
}: Props) {
  const dispatch = useAppDispatch()
  const containerRef = useRef<HTMLDivElement>(null)

  if (!line) return null

  const handleMouseDown = (e: React.MouseEvent, endpoint: 'start' | 'end') => {
    e.stopPropagation()
    const container = containerRef.current?.parentElement
    const canvas = container?.querySelector('canvas')
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    // Convert to world coordinates
    const x = (e.clientX - rect.left - originX) / zoom
    const y = (e.clientY - rect.top - originY) / zoom
    dispatch(AppActions['lineEndpoint/started'](endpoint, x, y))
  }

  const endpoints = [
    { position: 'start' as const, x: line.x, y: line.y },
    { position: 'end' as const, x: line.x2, y: line.y2 },
  ]

  return (
    <div ref={containerRef}>
      {endpoints.map(({ position, x, y }) => (
        <div
          key={position}
          data-testid={`line-handle-${position}`}
          onMouseDown={(e) => handleMouseDown(e, position)}
          style={{
            position: 'absolute',
            left: originX + x * zoom - SELECTION_HANDLE_SIZE / 2,
            top: originY + y * zoom - SELECTION_HANDLE_SIZE / 2,
            width: SELECTION_HANDLE_SIZE,
            height: SELECTION_HANDLE_SIZE,
            backgroundColor: SELECTION_HANDLE_FILL,
            border: `${SELECTION_HANDLE_STROKE_WIDTH}px solid ${SELECTION_BORDER_COLOR}`,
            borderRadius: '50%',
            cursor: 'crosshair',
            boxSizing: 'border-box',
          }}
        />
      ))}
    </div>
  )
}
