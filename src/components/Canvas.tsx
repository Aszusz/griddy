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
} from '../store/selectors'
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
  const shapes = useAppSelector(selectShapes)
  const selectedIds = useAppSelector(selectSelectedIds)
  const marquee = useAppSelector(selectMarquee)
  const previewRect = useAppSelector(selectPreviewRect)
  const previewLine = useAppSelector(selectPreviewLine)
  const panX = useAppSelector(selectPanX)
  const panY = useAppSelector(selectPanY)

  const { containerRef, canvasSize } = useCanvasSize()
  const originX = canvasSize.width / 2 + panX
  const originY = canvasSize.height / 2 + panY

  const { handlers, hoverCursor } = useCanvasEvents(originX, originY)
  useGlobalDrag(canvasRef, originX, originY)

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

    drawGrid(ctx, originX, originY, canvasSize.width, canvasSize.height)
    drawShapes(ctx, shapes)
    drawSelectionBounds(ctx, selectionBoundsShapes)
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
      />
      <ResizeHandles
        shape={singleSelectedRectShape}
        originX={originX}
        originY={originY}
      />
      <LineEndpointHandles
        line={singleSelectedLine}
        originX={originX}
        originY={originY}
      />
      <div
        className="animate-in fade-in absolute bottom-4 left-4 flex items-center gap-3 font-mono text-[10px] tracking-wider text-zinc-600 duration-500"
        style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
      >
        <span>0, 0</span>
        <span className="text-zinc-700">•</span>
        <span>100%</span>
      </div>
    </div>
  )
}
