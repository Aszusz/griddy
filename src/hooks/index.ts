import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export { useCanvasSize } from './useCanvasSize'
export { useGlobalDrag } from './useGlobalDrag'
export { useCanvasEvents } from './useCanvasEvents'
export { useKeyboardShortcuts } from './useKeyboardShortcuts'
export { useFileOperations } from './useFileOperations'
