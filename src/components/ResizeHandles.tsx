import { useRef } from 'react'
import type { RectShape, HandlePosition } from '../store/state'
import { useAppDispatch } from '../hooks'
import { AppActions } from '../store/actions'
import {
  HANDLE_POSITIONS,
  SELECTION_HANDLE_SIZE,
  SELECTION_HANDLE_FILL,
  SELECTION_HANDLE_STROKE_WIDTH,
  SELECTION_BORDER_COLOR,
} from '../constants'

type Props = {
  shape: RectShape | undefined
  originX: number
  originY: number
}

export function ResizeHandles({ shape, originX, originY }: Props) {
  const dispatch = useAppDispatch()
  const containerRef = useRef<HTMLDivElement>(null)

  if (!shape) return null

  const handleMouseDown = (e: React.MouseEvent, position: HandlePosition) => {
    e.stopPropagation()
    const container = containerRef.current?.parentElement
    const canvas = container?.querySelector('canvas')
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - originX
    const y = e.clientY - rect.top - originY
    dispatch(AppActions['resize/started'](position, x, y))
  }

  return (
    <div ref={containerRef}>
      {HANDLE_POSITIONS.map(({ position, cursor, getOffset }) => {
        const offset = getOffset(shape)
        return (
          <div
            key={position}
            data-testid={`resize-handle-${position}`}
            onMouseDown={(e) => handleMouseDown(e, position)}
            style={{
              position: 'absolute',
              left: originX + offset.x - SELECTION_HANDLE_SIZE / 2,
              top: originY + offset.y - SELECTION_HANDLE_SIZE / 2,
              width: SELECTION_HANDLE_SIZE,
              height: SELECTION_HANDLE_SIZE,
              backgroundColor: SELECTION_HANDLE_FILL,
              border: `${SELECTION_HANDLE_STROKE_WIDTH}px solid ${SELECTION_BORDER_COLOR}`,
              cursor,
              boxSizing: 'border-box',
            }}
          />
        )
      })}
    </div>
  )
}
