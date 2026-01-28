import { useEffect, useMemo, useRef, useState } from 'react'
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
  selectPreviewText,
  selectPanX,
  selectPanY,
  selectZoom,
  selectEditingTextId,
} from '../store/selectors'
import { AppActions } from '../store/actions'
import { useAppDispatch } from '../hooks'
import { isLineShape, isTextShape, isRectShape } from '../utils'
import {
  drawGrid,
  drawShapes,
  drawSelectionBounds,
  drawPreview,
  drawPreviewLine,
  drawPreviewText,
  drawMarquee,
  drawCrosshair,
} from '../canvas/draw'
import { TextEditor } from './TextEditor'
import { ShapeTextEditor } from './ShapeTextEditor'
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
  const previewText = useAppSelector(selectPreviewText)
  const editingTextId = useAppSelector(selectEditingTextId)
  const panX = useAppSelector(selectPanX)
  const panY = useAppSelector(selectPanY)
  const zoom = useAppSelector(selectZoom)

  const { containerRef, canvasSize } = useCanvasSize()
  const originX = canvasSize.width / 2 + panX
  const originY = canvasSize.height / 2 + panY

  const [themeColors, setThemeColors] = useState({
    gridDotColor: '',
    selectionColor: '',
    marqueeFill: '',
  })
  useEffect(() => {
    const update = () => {
      const style = getComputedStyle(document.documentElement)
      setThemeColors({
        gridDotColor: style.getPropertyValue('--grid-dot-color').trim(),
        selectionColor: style.getPropertyValue('--selection-color').trim(),
        marqueeFill: style.getPropertyValue('--marquee-fill').trim(),
      })
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

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
    singleSelectedShape &&
    !isLineShape(singleSelectedShape) &&
    !isTextShape(singleSelectedShape)
      ? singleSelectedShape
      : undefined
  const singleSelectedTextShape =
    singleSelectedShape && isTextShape(singleSelectedShape)
      ? singleSelectedShape
      : undefined
  const editingTextShape = editingTextId
    ? shapes.find((s) => s.id === editingTextId && isTextShape(s))
    : undefined
  const editingRectShape = editingTextId
    ? shapes.find((s) => s.id === editingTextId && isRectShape(s))
    : undefined
  // Lines show point handles instead of selection border
  // Editing text shows HTML textarea with its own border
  const selectionBoundsShapes = useMemo(
    () =>
      singleSelectedLine
        ? []
        : selectedShapes.filter((s) => s.id !== editingTextId),
    [singleSelectedLine, selectedShapes, editingTextId]
  )

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !canvasRef.current) return

    ctx.save()
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    ctx.translate(originX, originY)
    ctx.scale(zoom, zoom)

    drawGrid(
      ctx,
      originX,
      originY,
      canvasSize.width,
      canvasSize.height,
      zoom,
      themeColors.gridDotColor
    )
    drawShapes(ctx, shapes, editingTextId)
    drawSelectionBounds(
      ctx,
      selectionBoundsShapes,
      zoom,
      themeColors.selectionColor
    )
    drawPreview(ctx, previewRect)
    drawPreviewLine(ctx, previewLine)
    drawPreviewText(ctx, previewText)
    drawMarquee(
      ctx,
      marquee,
      themeColors.selectionColor,
      themeColors.marqueeFill
    )
    drawCrosshair(ctx)

    ctx.restore()
  }, [
    shapes,
    previewRect,
    previewLine,
    previewText,
    canvasSize,
    originX,
    originY,
    zoom,
    selectionBoundsShapes,
    marquee,
    editingTextId,
    themeColors,
  ])

  return (
    <div
      ref={containerRef}
      data-testid="canvas-container"
      className="animate-in fade-in bg-canvas absolute inset-0 duration-700"
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
      {editingTextShape && isTextShape(editingTextShape) && (
        <TextEditor
          shape={editingTextShape}
          originX={originX}
          originY={originY}
          zoom={zoom}
        />
      )}
      {editingRectShape && isRectShape(editingRectShape) && (
        <ShapeTextEditor
          shape={editingRectShape}
          originX={originX}
          originY={originY}
          zoom={zoom}
        />
      )}
      {/* Text shapes also need resize handles */}
      {singleSelectedTextShape && !editingTextId && (
        <ResizeHandles
          shape={singleSelectedTextShape}
          originX={originX}
          originY={originY}
          zoom={zoom}
        />
      )}
    </div>
  )
}
