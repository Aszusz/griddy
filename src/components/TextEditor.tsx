import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../hooks'
import { AppActions } from '../store/actions'
import type { TextShape } from '../store/state'
import {
  FONT_MAP,
  TEXT_FONT_SIZE,
  TEXT_LINE_HEIGHT,
  TEXT_PADDING,
  SELECTION_BORDER_OFFSET,
  SELECTION_BORDER_WIDTH,
} from '../constants'

type Props = {
  shape: TextShape
  originX: number
  originY: number
  zoom: number
}

export function TextEditor({ shape, originX, originY, zoom }: Props) {
  const dispatch = useAppDispatch()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const screenX = originX + shape.x * zoom
  const screenY = originY + shape.y * zoom
  const screenWidth = shape.width * zoom
  const screenHeight = shape.height * zoom

  useEffect(() => {
    textareaRef.current?.focus()
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

  return (
    <textarea
      ref={textareaRef}
      value={shape.text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        width: screenWidth,
        height: screenHeight,
        boxSizing: 'border-box',
        paddingLeft: TEXT_PADDING * zoom,
        paddingRight: TEXT_PADDING * zoom,
        paddingTop:
          (TEXT_PADDING - (TEXT_LINE_HEIGHT - TEXT_FONT_SIZE) / 2) * zoom,
        paddingBottom: 0,
        fontSize: `${TEXT_FONT_SIZE * zoom}px`,
        fontFamily: FONT_MAP[shape.fontFamily],
        textAlign: shape.align,
        color: shape.fill,
        background: 'transparent',
        border: 'none',
        outline: `${SELECTION_BORDER_WIDTH}px solid var(--selection-color)`,
        outlineOffset: SELECTION_BORDER_OFFSET,
        resize: 'none',
        overflow: 'hidden',
        lineHeight: `${TEXT_LINE_HEIGHT * zoom}px`,
      }}
    />
  )
}
