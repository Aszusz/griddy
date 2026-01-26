import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './index'
import { AppActions } from '../store/actions'
import { selectActiveTool } from '../store/selectors'

export function useKeyboardShortcuts() {
  const dispatch = useAppDispatch()
  const activeTool = useAppSelector(selectActiveTool)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTool !== 'select') return

      const isMod = e.metaKey || e.ctrlKey

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

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch, activeTool])
}
