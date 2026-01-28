import { useRef, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '.'
import { AppActions } from '../store/actions'
import { selectShapes } from '../store/selectors'
import type { Shape } from '../store/state'

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
  }, [dispatch, pendingShapes])

  const handleCancel = useCallback(() => {
    setShowConfirm(false)
    setPendingShapes(null)
  }, [])

  const clearError = useCallback(() => {
    setErrorMessage(null)
  }, [])

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
  }
}
