import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './index'
import { AppActions } from '../store/actions'
import { selectActiveTool } from '../store/selectors'

function isInputFocused(): boolean {
  const active = document.activeElement
  return (
    active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement
  )
}

export function useKeyboardShortcuts() {
  const dispatch = useAppDispatch()
  const activeTool = useAppSelector(selectActiveTool)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused()) return

      const isMod = e.metaKey || e.ctrlKey

      // Tool shortcuts (work from any tool)
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        dispatch(AppActions['tool/selected']('pan'))
        return
      }
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        dispatch(AppActions['tool/selected']('ellipse'))
        return
      }
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault()
        dispatch(AppActions['tool/selected']('line'))
        return
      }
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        dispatch(AppActions['tool/selected']('arrow'))
        return
      }

      // Reset view (Cmd/Ctrl+0)
      if (isMod && e.key === '0') {
        e.preventDefault()
        dispatch(AppActions['pan/reset']())
        return
      }

      // Zoom in (Cmd/Ctrl+=)
      if (isMod && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        dispatch(AppActions['zoom/in']())
        return
      }

      // Zoom out (Cmd/Ctrl+-)
      if (isMod && e.key === '-') {
        e.preventDefault()
        dispatch(AppActions['zoom/out']())
        return
      }

      // Undo (Cmd/Ctrl+Z)
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        dispatch(AppActions['history/undo']())
        return
      }

      // Redo (Cmd/Ctrl+Shift+Z)
      if (isMod && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        dispatch(AppActions['history/redo']())
        return
      }

      // Spacebar pan mode
      if (e.key === ' ' && !e.repeat) {
        e.preventDefault()
        dispatch(AppActions['spacebar/pressed']())
        return
      }

      // Select tool shortcuts
      if (activeTool !== 'select') return

      if (isMod && e.key === 'c') {
        e.preventDefault()
        dispatch(AppActions['clipboard/copy']())
      } else if (isMod && e.key === 'x') {
        e.preventDefault()
        dispatch(AppActions['clipboard/cut']())
      } else if (isMod && e.key === 'v') {
        e.preventDefault()
        dispatch(AppActions['clipboard/paste']())
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        dispatch(AppActions['selection/delete']())
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isInputFocused()) return

      if (e.key === ' ') {
        e.preventDefault()
        dispatch(AppActions['spacebar/released']())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [dispatch, activeTool])
}
