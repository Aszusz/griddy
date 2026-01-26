import { useEffect, type RefObject } from 'react'
import { useAppDispatch, useAppSelector } from './index'
import { AppActions } from '../store/actions'
import {
  selectDrawing,
  selectMarquee,
  selectMove,
  selectResize,
} from '../store/selectors'

export function useGlobalDrag(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  originX: number,
  originY: number
) {
  const dispatch = useAppDispatch()
  const drawing = useAppSelector(selectDrawing)
  const marquee = useAppSelector(selectMarquee)
  const move = useAppSelector(selectMove)
  const resize = useAppSelector(selectResize)

  useEffect(() => {
    const isDragging = drawing || marquee || move || resize
    if (!isDragging) return
    const canvas = canvasRef.current
    if (!canvas) return

    const onGlobalMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left - originX
      const y = e.clientY - rect.top - originY
      if (drawing) dispatch(AppActions['drawing/moved'](x, y))
      if (marquee) dispatch(AppActions['marquee/moved'](x, y))
      if (move) dispatch(AppActions['move/moved'](x, y))
      if (resize) dispatch(AppActions['resize/moved'](x, y))
    }

    const onGlobalMouseUp = () => {
      if (drawing) dispatch(AppActions['drawing/ended']())
      if (marquee) dispatch(AppActions['marquee/ended']())
      if (move) dispatch(AppActions['move/ended']())
      if (resize) dispatch(AppActions['resize/ended']())
    }

    window.addEventListener('mousemove', onGlobalMouseMove)
    window.addEventListener('mouseup', onGlobalMouseUp)
    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove)
      window.removeEventListener('mouseup', onGlobalMouseUp)
    }
  }, [drawing, marquee, move, resize, dispatch, originX, originY, canvasRef])
}
