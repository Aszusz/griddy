import { useRef, useState, useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '.'
import { AppActions } from '../store/actions'
import { selectShapes } from '../store/selectors'
import type { Shape } from '../store/state'
import { drawShapes } from '../canvas/draw'
import { getShapeBounds } from '../utils'
import { EXPORT_PNG_PADDING, EXPORT_PNG_BG } from '../constants'
import LZString from 'lz-string'

export function useFileOperations() {
  const dispatch = useAppDispatch()
  const shapes = useAppSelector(selectShapes)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingShapes, setPendingShapes] = useState<Shape[] | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSave = useCallback(() => {
    const data = { shapes }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'canvas.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [shapes])

  const handleOpenClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      e.target.value = ''

      try {
        const text = await file.text()
        const data = JSON.parse(text)
        if (!Array.isArray(data.shapes)) {
          throw new Error('Invalid file format')
        }
        setPendingShapes(data.shapes)
        setShowConfirm(true)
        setErrorMessage(null)
      } catch {
        setErrorMessage('Failed to load file')
        setShowConfirm(false)
        setPendingShapes(null)
      }
    },
    []
  )

  const handleConfirm = useCallback(() => {
    if (pendingShapes) {
      dispatch(AppActions['file/load'](pendingShapes))
    }
    setShowConfirm(false)
    setPendingShapes(null)
    // Clear URL hash if present
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [dispatch, pendingShapes])

  const handleCancel = useCallback(() => {
    setShowConfirm(false)
    setPendingShapes(null)
  }, [])

  const clearError = useCallback(() => {
    setErrorMessage(null)
  }, [])

  // Process URL hash for shared links
  const processHash = useCallback(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return

    try {
      const decoded = LZString.decompressFromEncodedURIComponent(hash)
      if (!decoded) {
        throw new Error('Invalid link data')
      }
      const data = JSON.parse(decoded)
      if (!Array.isArray(data.shapes)) {
        throw new Error('Invalid file format')
      }
      // Load immediately if canvas empty, otherwise confirm
      if (shapes.length === 0) {
        dispatch(AppActions['file/load'](data.shapes))
        window.history.replaceState(null, '', window.location.pathname)
      } else {
        setPendingShapes(data.shapes)
        setShowConfirm(true)
      }
    } catch {
      setErrorMessage('Invalid shared link')
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [dispatch, shapes.length])

  // Check hash on mount and listen for hash changes
  useEffect(() => {
    processHash()
    window.addEventListener('hashchange', processHash)
    return () => window.removeEventListener('hashchange', processHash)
  }, [processHash])

  const handleCopyLink = useCallback(async () => {
    if (shapes.length === 0) {
      setErrorMessage('Canvas is empty')
      return
    }

    const data = JSON.stringify({ shapes })
    const compressed = LZString.compressToEncodedURIComponent(data)
    const url = `${window.location.origin}${window.location.pathname}#${compressed}`
    await navigator.clipboard.writeText(url)
  }, [shapes])

  const handleExportPng = useCallback(() => {
    if (shapes.length === 0) {
      setErrorMessage('Canvas is empty')
      return
    }

    // Calculate bounding box of all shapes
    const bounds = shapes.map(getShapeBounds)
    const minX = Math.min(...bounds.map((b) => b.minX))
    const minY = Math.min(...bounds.map((b) => b.minY))
    const maxX = Math.max(...bounds.map((b) => b.maxX))
    const maxY = Math.max(...bounds.map((b) => b.maxY))

    const width = maxX - minX + EXPORT_PNG_PADDING * 2
    const height = maxY - minY + EXPORT_PNG_PADDING * 2

    // Create offscreen canvas
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // White background
    ctx.fillStyle = EXPORT_PNG_BG
    ctx.fillRect(0, 0, width, height)

    // Translate to account for shape offset + padding
    ctx.translate(-minX + EXPORT_PNG_PADDING, -minY + EXPORT_PNG_PADDING)

    // Draw shapes
    drawShapes(ctx, shapes)

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'canvas.png'
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }, [shapes])

  return {
    fileInputRef,
    showConfirm,
    errorMessage,
    handleSave,
    handleOpenClick,
    handleFileChange,
    handleConfirm,
    handleCancel,
    clearError,
    handleExportPng,
    handleCopyLink,
  }
}
