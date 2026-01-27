import { useState } from 'react'
import { useAppDispatch, useAppSelector } from './index'
import { AppActions } from '../store/actions'
import {
  selectActiveTool,
  selectShapes,
  selectDrawing,
  selectSelectedIds,
  selectMarquee,
  selectMove,
  selectResize,
  selectPan,
  selectEditingTextId,
} from '../store/selectors'
import { pointHitsShape, isTextShape } from '../utils'

export function useCanvasEvents(originX: number, originY: number, zoom = 1) {
  const dispatch = useAppDispatch()
  const activeTool = useAppSelector(selectActiveTool)
  const shapes = useAppSelector(selectShapes)
  const drawing = useAppSelector(selectDrawing)
  const selectedIds = useAppSelector(selectSelectedIds)
  const marquee = useAppSelector(selectMarquee)
  const move = useAppSelector(selectMove)
  const resize = useAppSelector(selectResize)
  const pan = useAppSelector(selectPan)
  const editingTextId = useAppSelector(selectEditingTextId)
  const [hoverCursor, setHoverCursor] = useState('auto')

  const getCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    // originX/originY already includes panX/panY from Canvas
    // Convert from screen to world coordinates by dividing by zoom
    return {
      x: (e.clientX - rect.left - originX) / zoom,
      y: (e.clientY - rect.top - originY) / zoom,
    }
  }

  const getScreenCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // If editing text and clicking on canvas, stop editing (blur will handle it)
    // Don't start other actions on this click to avoid creating history entries
    if (editingTextId) {
      return
    }
    if (activeTool === 'pan') {
      const { x, y } = getScreenCoords(e)
      dispatch(AppActions['pan/started'](x, y))
      return
    }
    const { x, y } = getCoords(e)
    if (
      activeTool === 'rectangle' ||
      activeTool === 'ellipse' ||
      activeTool === 'line' ||
      activeTool === 'arrow' ||
      activeTool === 'text'
    ) {
      dispatch(AppActions['drawing/started'](x, y))
    } else if (activeTool === 'select') {
      const clickedShape = shapes.find((s) => pointHitsShape(x, y, s))
      if (clickedShape) {
        const isAlreadySelected = selectedIds.includes(clickedShape.id)
        if (e.shiftKey) {
          dispatch(AppActions['selection/clicked'](x, y, e.shiftKey))
        } else {
          if (!isAlreadySelected) {
            dispatch(AppActions['selection/clicked'](x, y, false))
          }
          dispatch(AppActions['move/started'](x, y))
        }
      } else {
        dispatch(AppActions['marquee/started'](x, y))
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCoords(e)
    dispatch(AppActions['mouse/moved'](coords.x, coords.y))

    if (pan) {
      const { x, y } = getScreenCoords(e)
      dispatch(AppActions['pan/moved'](x, y))
      return
    }
    const { x, y } = coords
    if (drawing) {
      dispatch(AppActions['drawing/moved'](x, y))
    } else if (marquee) {
      dispatch(AppActions['marquee/moved'](x, y))
    } else if (move) {
      dispatch(AppActions['move/moved'](x, y))
    }

    if (activeTool === 'select' && !drawing && !marquee && !resize) {
      const hoveredShape = shapes.find((s) => pointHitsShape(x, y, s))
      if (hoveredShape && selectedIds.includes(hoveredShape.id)) {
        setHoverCursor('move')
      } else {
        setHoverCursor('auto')
      }
    } else if (activeTool !== 'pan') {
      setHoverCursor('auto')
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (pan) {
      dispatch(AppActions['pan/ended']())
      return
    }
    if (drawing) dispatch(AppActions['drawing/ended']())
    else if (marquee) dispatch(AppActions['marquee/ended'](e.shiftKey))
    else if (move) dispatch(AppActions['move/ended']())
  }

  const handleMouseLeave = () => {
    dispatch(AppActions['mouse/left']())
  }

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoords(e)
    const clickedShape = shapes.find((s) => pointHitsShape(x, y, s))
    if (clickedShape && isTextShape(clickedShape)) {
      dispatch(AppActions['text/startEdit'](clickedShape.id))
    }
  }

  // Compute cursor based on tool and state
  let cursor = hoverCursor
  if (activeTool === 'pan') {
    cursor = pan ? 'grabbing' : 'grab'
  }

  return {
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onDoubleClick: handleDoubleClick,
    },
    hoverCursor: cursor,
  }
}
