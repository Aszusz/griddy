import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from './index'
import { AppActions } from '../store/actions'

export function useCanvasSize() {
  const dispatch = useAppDispatch()
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        const { width, height } = entry.contentRect
        setCanvasSize({ width, height })
        dispatch(AppActions['viewport/resized'](width, height))
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [dispatch])

  return { containerRef, canvasSize }
}
