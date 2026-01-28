import { useRef, useState, useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '.'
import { AppActions } from '../store/actions'
import { selectShapes } from '../store/selectors'
import type { Shape } from '../store/state'
import { drawShapes } from '../canvas/draw'
import { getShapeBounds } from '../utils'
import {
  EXPORT_PNG_PADDING,
  EXPORT_PNG_BG,
  LOCALSTORAGE_KEY,
} from '../constants'
import LZString from 'lz-string'

export function useFileOperations() {
  const dispatch = useAppDispatch()
  const shapes = useAppSelector(selectShapes)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasLoadedRef = useRef(false)
  const [pendingShapes, setPendingShapes] = useState<Shape[] | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<'load' | 'new' | null>(
    null
  )

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
        setPendingAction('load')
        setShowConfirm(true)
        setErrorMessage(null)
      } catch {
        setErrorMessage('Failed to load file')
        setShowConfirm(false)
        setPendingShapes(null)
        setPendingAction(null)
      }
    },
    []
  )

  const handleConfirm = useCallback(() => {
    if (pendingAction === 'new') {
      dispatch(AppActions['file/load']([]))
      localStorage.removeItem(LOCALSTORAGE_KEY)
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    } else if (pendingShapes) {
      dispatch(AppActions['file/load'](pendingShapes))
      // Clear URL hash if present
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
    setShowConfirm(false)
    setPendingShapes(null)
    setPendingAction(null)
  }, [dispatch, pendingShapes, pendingAction])

  const handleCancel = useCallback(() => {
    setShowConfirm(false)
    setPendingShapes(null)
    setPendingAction(null)
    // If cancelling a shared link with localStorage data, load localStorage
    if (window.location.hash && shapes.length === 0) {
      try {
        const stored = localStorage.getItem(LOCALSTORAGE_KEY)
        if (stored) {
          const data = JSON.parse(stored)
          if (Array.isArray(data.shapes) && data.shapes.length > 0) {
            dispatch(AppActions['file/load'](data.shapes))
          }
        }
      } catch {
        // Ignore
      }
      // Clear the hash since we're not using it
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [dispatch, shapes.length])

  const clearError = useCallback(() => {
    setErrorMessage(null)
  }, [])

  // Handle New menu item
  const handleNew = useCallback(() => {
    if (shapes.length === 0) {
      // No confirmation needed
      return
    }
    setPendingAction('new')
    setShowConfirm(true)
  }, [shapes.length])

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
      // Check if localStorage has content (for initial load)
      let hasLocalStorage = false
      try {
        const stored = localStorage.getItem(LOCALSTORAGE_KEY)
        if (stored) {
          const lsData = JSON.parse(stored)
          hasLocalStorage =
            Array.isArray(lsData.shapes) && lsData.shapes.length > 0
        }
      } catch {
        // Ignore
      }
      // Load immediately if canvas empty AND no localStorage, otherwise confirm
      if (shapes.length === 0 && !hasLocalStorage) {
        dispatch(AppActions['file/load'](data.shapes))
        window.history.replaceState(null, '', window.location.pathname)
      } else {
        setPendingShapes(data.shapes)
        setPendingAction('load')
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

  // Load from localStorage on startup (if no hash)
  // Use ref to prevent StrictMode double-mount from reloading and clearing selection
  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true
    if (window.location.hash) return // Hash takes priority
    try {
      const stored = localStorage.getItem(LOCALSTORAGE_KEY)
      if (!stored) return
      const data = JSON.parse(stored)
      if (Array.isArray(data.shapes) && data.shapes.length > 0) {
        dispatch(AppActions['file/load'](data.shapes))
      }
    } catch {
      // Corrupted data - silently ignore
    }
  }, [dispatch])

  // Auto-save to localStorage on shape changes
  // Skip saving empty shapes if localStorage has data (avoids overwriting on mount)
  useEffect(() => {
    if (shapes.length === 0) {
      // Don't overwrite existing localStorage with empty shapes
      const existing = localStorage.getItem(LOCALSTORAGE_KEY)
      if (existing) {
        try {
          const data = JSON.parse(existing)
          if (Array.isArray(data.shapes) && data.shapes.length > 0) {
            return // Don't overwrite
          }
        } catch {
          // Corrupted, ok to overwrite
        }
      }
    }
    const data = JSON.stringify({ shapes })
    localStorage.setItem(LOCALSTORAGE_KEY, data)
  }, [shapes])

  // Cross-tab sync via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== LOCALSTORAGE_KEY || !e.newValue) return
      try {
        const data = JSON.parse(e.newValue)
        if (Array.isArray(data.shapes)) {
          dispatch(AppActions['file/load'](data.shapes))
        }
      } catch {
        // Ignore parse errors
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [dispatch])

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
    handleNew,
  }
}
