import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../hooks'
import { AppActions } from '../store/actions'
import type { RectShape } from '../store/state'
import {
  TEXT_FONT_SIZE,
  TEXT_LINE_HEIGHT,
  TEXT_PADDING,
  SELECTION_BORDER_COLOR,
  SELECTION_BORDER_OFFSET,
  SELECTION_BORDER_WIDTH,
} from '../constants'

type Props = {
  shape: RectShape
  originX: number
  originY: number
  zoom: number
}

export function ShapeTextEditor({ shape, originX, originY, zoom }: Props) {
  const dispatch = useAppDispatch()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const screenX = originX + shape.x * zoom
  const screenY = originY + shape.y * zoom
  const screenWidth = shape.width * zoom
  const screenHeight = shape.height * zoom

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.focus()
      // Select all text if shape already has text (only on mount)
      if (shape.text) {
        textarea.select()
      }
    }
    // Only run on mount, not when text changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(AppActions['text/updateContent'](shape.id, e.target.value))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      dispatch(AppActions['text/stopEdit']())
    }
    e.stopPropagation()
  }

  const handleBlur = () => {
    dispatch(AppActions['text/stopEdit']())
  }

  // Compute text alignment styles
  const textAlign = shape.textAlign ?? 'center'
  const textVAlign = shape.textVAlign ?? 'middle'

  // Vertical alignment via flexbox
  const justifyContent =
    textVAlign === 'top'
      ? 'flex-start'
      : textVAlign === 'bottom'
        ? 'flex-end'
        : 'center'

  return (
    <div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        width: screenWidth,
        height: screenHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent,
        alignItems: 'stretch',
        outline: `${SELECTION_BORDER_WIDTH}px solid ${SELECTION_BORDER_COLOR}`,
        outlineOffset: SELECTION_BORDER_OFFSET,
        boxSizing: 'border-box',
        padding: TEXT_PADDING * zoom,
      }}
    >
      <textarea
        ref={textareaRef}
        value={shape.text ?? ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        style={{
          width: '100%',
          maxHeight: '100%',
          boxSizing: 'border-box',
          fontSize: `${TEXT_FONT_SIZE * zoom}px`,
          fontFamily: 'system-ui, sans-serif',
          textAlign,
          color: shape.stroke,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          overflow: 'hidden',
          lineHeight: `${TEXT_LINE_HEIGHT * zoom}px`,
        }}
      />
    </div>
  )
}
