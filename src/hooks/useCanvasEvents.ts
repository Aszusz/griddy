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
} from '../store/selectors'
import { pointInRect } from '../utils'

export function useCanvasEvents(originX: number, originY: number) {
  const dispatch = useAppDispatch()
  const activeTool = useAppSelector(selectActiveTool)
  const shapes = useAppSelector(selectShapes)
  const drawing = useAppSelector(selectDrawing)
  const selectedIds = useAppSelector(selectSelectedIds)
  const marquee = useAppSelector(selectMarquee)
  const move = useAppSelector(selectMove)
  const resize = useAppSelector(selectResize)
  const [hoverCursor, setHoverCursor] = useState('auto')

  const getCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: e.clientX - rect.left - originX,
      y: e.clientY - rect.top - originY,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoords(e)
    if (activeTool === 'rectangle') {
      dispatch(AppActions['drawing/started'](x, y))
    } else if (activeTool === 'select') {
      const clickedShape = shapes.find((s) => pointInRect(x, y, s))
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
    const { x, y } = getCoords(e)
    if (drawing) {
      dispatch(AppActions['drawing/moved'](x, y))
    } else if (marquee) {
      dispatch(AppActions['marquee/moved'](x, y))
    } else if (move) {
      dispatch(AppActions['move/moved'](x, y))
    }

    if (activeTool === 'select' && !drawing && !marquee && !resize) {
      const hoveredShape = shapes.find((s) => pointInRect(x, y, s))
      if (hoveredShape && selectedIds.includes(hoveredShape.id)) {
        setHoverCursor('move')
      } else {
        setHoverCursor('auto')
      }
    } else {
      setHoverCursor('auto')
    }
  }

  const handleMouseUp = () => {
    if (drawing) dispatch(AppActions['drawing/ended']())
    else if (marquee) dispatch(AppActions['marquee/ended']())
    else if (move) dispatch(AppActions['move/ended']())
  }

  return {
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
    hoverCursor,
  }
}
