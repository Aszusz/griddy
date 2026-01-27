import { useEffect, useMemo, useRef } from 'react'
import { CANVAS_BG } from '../constants'
import {
  useAppSelector,
  useCanvasSize,
  useGlobalDrag,
  useCanvasEvents,
} from '../hooks'
import {
  selectShapes,
  selectSelectedIds,
  selectMarquee,
  selectPreviewRect,
  selectPreviewLine,
  selectPanX,
  selectPanY,
  selectZoom,
} from '../store/selectors'
import { AppActions } from '../store/actions'
import { useAppDispatch } from '../hooks'
import { isLineShape } from '../utils'
import {
  drawGrid,
  drawShapes,
  drawSelectionBounds,
  drawPreview,
  drawPreviewLine,
  drawMarquee,
  drawCrosshair,
} from '../canvas/draw'
import { ResizeHandles } from './ResizeHandles'
import { LineEndpointHandles } from './LineEndpointHandles'

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dispatch = useAppDispatch()
  const shapes = useAppSelector(selectShapes)
  const selectedIds = useAppSelector(selectSelectedIds)
  const marquee = useAppSelector(selectMarquee)
  const previewRect = useAppSelector(selectPreviewRect)
  const previewLine = useAppSelector(selectPreviewLine)
  const panX = useAppSelector(selectPanX)
  const panY = useAppSelector(selectPanY)
  const zoom = useAppSelector(selectZoom)

  const { containerRef, canvasSize } = useCanvasSize()
  const originX = canvasSize.width / 2 + panX
  const originY = canvasSize.height / 2 + panY

  const { handlers, hoverCursor } = useCanvasEvents(originX, originY, zoom)
  useGlobalDrag(canvasRef, originX, originY, zoom)

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      const rect = e.currentTarget.getBoundingClientRect()
      const screenX = e.clientX - rect.left
      const screenY = e.clientY - rect.top
      dispatch(AppActions['zoom/atPoint'](e.deltaY, screenX, screenY))
    }
  }

  const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))
  const singleSelectedShape =
    selectedIds.length === 1 ? selectedShapes[0] : undefined
  const singleSelectedLine =
    singleSelectedShape && isLineShape(singleSelectedShape)
      ? singleSelectedShape
      : undefined
  const singleSelectedRectShape =
    singleSelectedShape && !isLineShape(singleSelectedShape)
      ? singleSelectedShape
      : undefined
  // Lines show point handles instead of selection border
  const selectionBoundsShapes = useMemo(
    () => (singleSelectedLine ? [] : selectedShapes),
    [singleSelectedLine, selectedShapes]
  )

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !canvasRef.current) return

    ctx.save()
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    ctx.translate(originX, originY)
    ctx.scale(zoom, zoom)

    drawGrid(ctx, originX, originY, canvasSize.width, canvasSize.height, zoom)
    drawShapes(ctx, shapes)
    drawSelectionBounds(ctx, selectionBoundsShapes, zoom)
    drawPreview(ctx, previewRect)
    drawPreviewLine(ctx, previewLine)
    drawMarquee(ctx, marquee)
    drawCrosshair(ctx)

    ctx.restore()
  }, [
    shapes,
    previewRect,
    previewLine,
    canvasSize,
    originX,
    originY,
    zoom,
    selectionBoundsShapes,
    marquee,
  ])

  return (
    <div
      ref={containerRef}
      data-testid="canvas-container"
      className="animate-in fade-in absolute inset-0 duration-700"
      style={{ backgroundColor: CANVAS_BG }}
    >
      <canvas
        ref={canvasRef}
        data-testid="canvas"
        tabIndex={0}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute inset-0"
        style={{ cursor: hoverCursor }}
        {...handlers}
        onWheel={handleWheel}
      />
      <ResizeHandles
        shape={singleSelectedRectShape}
        originX={originX}
        originY={originY}
        zoom={zoom}
      />
      <LineEndpointHandles
        line={singleSelectedLine}
        originX={originX}
        originY={originY}
        zoom={zoom}
      />
    </div>
  )
}
