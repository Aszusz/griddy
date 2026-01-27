import { useEffect, type RefObject } from 'react'
import { useAppDispatch, useAppSelector } from './index'
import { AppActions } from '../store/actions'
import {
  selectDrawing,
  selectMarquee,
  selectMove,
  selectResize,
  selectLineEndpointDrag,
  selectPan,
} from '../store/selectors'

export function useGlobalDrag(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  originX: number,
  originY: number,
  zoom = 1
) {
  const dispatch = useAppDispatch()
  const drawing = useAppSelector(selectDrawing)
  const marquee = useAppSelector(selectMarquee)
  const move = useAppSelector(selectMove)
  const resize = useAppSelector(selectResize)
  const lineEndpointDrag = useAppSelector(selectLineEndpointDrag)
  const pan = useAppSelector(selectPan)

  useEffect(() => {
    const isDragging =
      drawing || marquee || move || resize || lineEndpointDrag || pan
    if (!isDragging) return
    const canvas = canvasRef.current
    if (!canvas) return

    const onGlobalMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      // Convert from screen to world coordinates
      const x = (e.clientX - rect.left - originX) / zoom
      const y = (e.clientY - rect.top - originY) / zoom
      if (drawing) dispatch(AppActions['drawing/moved'](x, y))
      if (marquee) dispatch(AppActions['marquee/moved'](x, y))
      if (move) dispatch(AppActions['move/moved'](x, y))
      if (resize) dispatch(AppActions['resize/moved'](x, y))
      if (lineEndpointDrag) dispatch(AppActions['lineEndpoint/moved'](x, y))
      if (pan) {
        // Pan uses screen coordinates, not world coordinates
        const screenX = e.clientX - rect.left
        const screenY = e.clientY - rect.top
        dispatch(AppActions['pan/moved'](screenX, screenY))
      }
    }

    const onGlobalMouseUp = (e: MouseEvent) => {
      if (drawing) dispatch(AppActions['drawing/ended']())
      if (marquee) dispatch(AppActions['marquee/ended'](e.shiftKey))
      if (move) dispatch(AppActions['move/ended']())
      if (resize) dispatch(AppActions['resize/ended']())
      if (lineEndpointDrag) dispatch(AppActions['lineEndpoint/ended']())
      if (pan) dispatch(AppActions['pan/ended']())
    }

    window.addEventListener('mousemove', onGlobalMouseMove)
    window.addEventListener('mouseup', onGlobalMouseUp)
    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove)
      window.removeEventListener('mouseup', onGlobalMouseUp)
    }
  }, [
    drawing,
    marquee,
    move,
    resize,
    lineEndpointDrag,
    pan,
    dispatch,
    originX,
    originY,
    zoom,
    canvasRef,
  ])
}
